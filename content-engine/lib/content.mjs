/**
 * content.mjs — Schema, slugging, MDX rendering, dedup, and IO.
 *
 * The frontmatter shape here MUST stay in lockstep with the loader's
 * expectations in src/lib/content/types.ts + articles.ts. If you change one,
 * change the other.
 */

import fs from "node:fs";
import path from "node:path";
import { config } from "../config.mjs";

/** Map a (possibly fuzzy) category label to an exact canonical label. */
export function normaliseCategory(label) {
  if (!label) return "Guides";
  const hit = config.categories.find(
    (c) => c.toLowerCase() === String(label).trim().toLowerCase(),
  );
  return hit ?? "Guides"; // loader falls back to Guides anyway; be explicit.
}

/** URL-safe slug from a title. Mirrors the "filename = slug" convention. */
export function slugify(title) {
  return String(title)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

const q = (s) => `"${String(s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

/**
 * Render a complete .mdx file (frontmatter + body) for an article object.
 * `article` fields map 1:1 to the frontmatter schema.
 */
export function renderMdx(article) {
  const {
    title, slug, excerpt, category, tags = [],
    author = config.defaultAuthor,
    publishedAt, updatedAt = publishedAt,
    cover, coverAlt, draft = true,
    seo = {}, body = "",
  } = article;

  const fm = [
    "---",
    `title: ${q(title)}`,
    `slug: ${q(slug)}`,
    `excerpt: ${q(excerpt)}`,
    `category: ${q(normaliseCategory(category))}`,
    "tags:",
    ...tags.map((t) => `  - ${q(t)}`),
    `author: ${q(author)}`,
    `publishedAt: ${q(publishedAt)}`,
    `updatedAt: ${q(updatedAt)}`,
    `cover: ${q(cover)}`,
    `coverAlt: ${q(coverAlt)}`,
    `draft: ${draft ? "true" : "false"}`,
    "seo:",
    `  metaTitle: ${q(seo.metaTitle ?? title)}`,
    `  metaDescription: ${q(seo.metaDescription ?? excerpt)}`,
    `  ogImage: ${q(seo.ogImage ?? cover)}`,
    "---",
    "",
  ].join("\n");

  return `${fm}\n${body.trim()}\n`;
}

/** All existing article slugs (published or draft) under content/insights. */
export function existingSlugs() {
  if (!fs.existsSync(config.insightsDir)) return [];
  return fs
    .readdirSync(config.insightsDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/** Cheap title fingerprint for near-duplicate detection. */
function fingerprint(title) {
  return new Set(
    String(title)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 &&
        !["the", "for", "and", "with", "your", "how", "what", "are", "you"].includes(w)),
  );
}

function jaccard(a, b) {
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size || 1;
  return inter / union;
}

/**
 * Dedup guard. Build once with all known titles/slugs (existing files + backlog
 * already accepted), then test candidates. Catches exact slug collisions and
 * near-duplicate titles (Jaccard ≥ 0.8 on significant tokens).
 */
export function makeDedup(knownTitles = []) {
  const slugs = new Set(existingSlugs());
  const prints = knownTitles.map(fingerprint);

  return {
    isDup(title) {
      const slug = slugify(title);
      if (slugs.has(slug)) return { dup: true, reason: `slug exists: ${slug}` };
      const fp = fingerprint(title);
      for (const p of prints) {
        if (jaccard(fp, p) >= 0.8) return { dup: true, reason: "near-duplicate title" };
      }
      return { dup: false };
    },
    add(title) {
      slugs.add(slugify(title));
      prints.push(fingerprint(title));
    },
  };
}

/** Write an article to content/insights/<slug>.mdx. Refuses to overwrite. */
export function writeArticle(article) {
  const slug = article.slug ?? slugify(article.title);
  const file = path.join(config.insightsDir, `${slug}.mdx`);
  if (fs.existsSync(file)) {
    throw new Error(`Refusing to overwrite existing file: ${slug}.mdx`);
  }
  fs.mkdirSync(config.insightsDir, { recursive: true });
  fs.writeFileSync(file, renderMdx({ ...article, slug }), "utf8");
  return file;
}

export default { normaliseCategory, slugify, renderMdx, existingSlugs, makeDedup, writeArticle };
