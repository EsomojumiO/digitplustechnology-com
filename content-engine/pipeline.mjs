/**
 * pipeline.mjs — Run one brief through the full agent chain into a finished,
 * quality-gated article object (and, when accepted, a written .mdx file).
 *
 *   brief → seo → outliner → writer → editor → optimizer → assemble → qa
 *
 * Every article is draft:true (human review before publish). Articles that fail
 * the quality gate or trip the lane check are returned as "held" and NOT written.
 */

import { config } from "./config.mjs";
import * as agents from "./agents.mjs";
import { slugify, normaliseCategory, renderMdx, writeArticle } from "./lib/content.mjs";

function pillarFor(clusterKey) {
  return (config.clusters.find((c) => c.key === clusterKey) ?? config.clusters[0]).pillar;
}

function defaultCategoryFor(clusterKey) {
  return (config.clusters.find((c) => c.key === clusterKey) ?? {}).category ?? "Guides";
}

/**
 * @param {object} brief - { title, cluster, market, category?, angle, primaryKeyword, ... }
 * @param {object} [opts] - { date, dryRun }
 * @returns {Promise<{status:'written'|'held'|'previewed', article, qa, file?, reasons?}>}
 */
export async function generateArticle(brief, opts = {}) {
  const date = opts.date ?? new Date().toISOString().slice(0, 10);
  const pillar = pillarFor(brief.cluster);
  const category = normaliseCategory(brief.category ?? defaultCategoryFor(brief.cluster));
  const slug = slugify(brief.title);

  // 2–6. The agent chain.
  const seoData = await agents.seo(brief);
  const outline = await agents.outliner(brief, seoData);
  const draft = await agents.writer(brief, seoData, outline, pillar);
  const edited = await agents.editor(brief, draft);
  const optimized = await agents.optimizer(brief, seoData, edited.body, pillar);

  // Assemble the article object (frontmatter + body).
  const article = {
    title: brief.title,
    slug,
    excerpt: optimized.excerpt,
    category,
    market: brief.market, // QA-only; not a frontmatter field
    tags: optimized.tags,
    author: config.defaultAuthor,
    publishedAt: date,
    updatedAt: date,
    cover: `/images/insights/${slug}.jpg`,
    coverAlt: seoData.coverAlt,
    draft: config.forceDraft ? true : false,
    seo: {
      metaTitle: seoData.metaTitle,
      metaDescription: seoData.metaDescription,
      ogImage: `/images/insights/${slug}.jpg`,
    },
    body: optimized.body,
  };

  // 7. Quality gate.
  const verdict = await agents.qa(article);
  const reasons = [];
  if (edited.laneViolation) reasons.push("editor flagged lane drift");
  if (verdict.laneViolation) reasons.push("QA flagged lane violation");
  if ((verdict.score ?? 0) < config.qualityThreshold) {
    reasons.push(`QA score ${verdict.score} < threshold ${config.qualityThreshold}`);
  }

  const held = reasons.length > 0;

  if (opts.dryRun) {
    return { status: "previewed", article, qa: verdict, mdx: renderMdx(article), reasons };
  }
  if (held) {
    return { status: "held", article, qa: verdict, reasons };
  }

  const file = writeArticle(article);
  return { status: "written", article, qa: verdict, file };
}

export default { generateArticle };
