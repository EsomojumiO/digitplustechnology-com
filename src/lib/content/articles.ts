/**
 * articles.ts, Public access layer for Insights articles.
 *
 * PUBLIC API (the CMS seam, keep these signatures stable):
 *   getAllArticles(): ArticleMeta[]
 *   getArticleBySlug(slug): Article | null
 *   getArticlesByCategory(categorySlug): ArticleMeta[]
 *   getAllCategories(): CategoryWithCount[]
 *   getArticlesByTag(tagSlug): ArticleMeta[]
 *   getAllTags(): TagWithCount[]
 *   getFeaturedArticles(n?): ArticleMeta[]
 *   getRelatedArticles(slug, n?): ArticleMeta[]
 *
 * Server-only (reads the filesystem at build time).
 *
 * DRAFTS. Every list query here — and therefore the hub, category and tag
 * archives, related rails, sitemap.ts and rss.xml, all of which go through
 * getAllArticles() — returns published articles ONLY, in every environment.
 * That is the property that keeps a draft out of the sitemap and the feed, and
 * it is deliberately not configurable.
 *
 * The single exception is getArticleBySlug(), which will return a draft when
 * draftPreviewEnabled() is true, so a draft can be reviewed at its own URL
 * before publication. The gate is NODE_ENV !== "production" and nothing else:
 * no config key, no env var, no query parameter. A production build cannot be
 * made to serve a draft by changing a setting, because there is no setting.
 * The article page additionally renders drafts noindex and shows a banner, so
 * a draft is still marked even if this gate is ever wrong.
 */

import "server-only";
import readingTime from "reading-time";
import {
  type Article,
  type ArticleMeta,
  type CategoryWithCount,
  categoryFromLabel,
  CATEGORIES,
} from "./types";
import {
  readCollection,
  readEntry,
  toISO,
  toBool,
  toStr,
  toStringArray,
  toSeo,
  type RawEntry,
} from "./source";
import { tagSlug, tagLabel, type TagWithCount } from "./tags";

const COLLECTION = "insights";

/* ---------------------------------------------------------------------------
   Mapping: RawEntry -> Article. Centralised so the CMS swap touches one place.
   Articles whose category label is unknown fall back to "Guides" rather than
   throwing, so a typo never breaks the build (logged in dev).
   --------------------------------------------------------------------------- */
function toArticle(entry: RawEntry): Article {
  const { data, content, slug } = entry;

  const publishedAt = toISO(data.publishedAt);
  const categoryLabel = toStr(data.category, "Guides");
  const category =
    categoryFromLabel(categoryLabel) ??
    CATEGORIES.find((c) => c.slug === "guides")!;

  const rt = readingTime(content);

  return {
    title: toStr(data.title, slug),
    slug: toStr(data.slug, slug) || slug,
    excerpt: toStr(data.excerpt),
    category,
    tags: toStringArray(data.tags),
    author: toStr(data.author, "Digitplus Technology"),
    publishedAt,
    updatedAt: toISO(data.updatedAt, publishedAt),
    cover: toStr(data.cover, `/images/insights/${slug}.jpg`),
    coverAlt: toStr(data.coverAlt),
    draft: toBool(data.draft, false),
    readingTime: {
      minutes: Math.max(1, Math.ceil(rt.minutes)),
      text: rt.text,
      words: rt.words,
    },
    seo: toSeo(data.seo),
    body: content,
  };
}

/**
 * Is draft preview available in this environment?
 *
 * NODE_ENV is set by the toolchain — `next build` forces "production" — so this
 * cannot be flipped from a dashboard or a .env file the way a custom flag could.
 * That is the whole reason it is the gate.
 */
export function draftPreviewEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}

/** Strip the body for list/card contexts. */
function toMeta(article: Article): ArticleMeta {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, ...meta } = article;
  return meta;
}

/** All published articles, mapped + sorted newest first. (internal cache-friendly) */
function loadPublished(): Article[] {
  return readCollection(COLLECTION)
    .map(toArticle)
    .filter((a) => !a.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

/* --------------------------------- PUBLIC --------------------------------- */

/** Published articles only, newest first. */
export function getAllArticles(): ArticleMeta[] {
  return loadPublished().map(toMeta);
}

/**
 * Full article (incl. raw MDX body + reading time) by slug.
 *
 * Returns null for a missing article, and for a draft in production. In
 * development a draft IS returned so it can be reviewed at its real URL; the
 * caller is responsible for marking it (noindex + banner) — see
 * app/insights/[slug]/page.tsx.
 */
export function getArticleBySlug(slug: string): Article | null {
  const entry = readEntry(COLLECTION, slug);
  if (!entry) return null;
  const article = toArticle(entry);
  if (article.draft && !draftPreviewEnabled()) return null;
  return article;
}

/**
 * Slugs of draft articles, for generateStaticParams only.
 *
 * Empty in production, so the route's dynamicParams=false continues to 404
 * every draft there. Not exported through lib/content's public index: this is
 * a build-time detail of the article route, not part of the CMS seam.
 */
export function getDraftSlugsForPreview(): string[] {
  if (!draftPreviewEnabled()) return [];
  return readCollection(COLLECTION)
    .map(toArticle)
    .filter((a) => a.draft)
    .map((a) => a.slug);
}

/** Published articles in a category (by category SLUG), newest first. */
export function getArticlesByCategory(categorySlug: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category.slug === categorySlug);
}

/** Categories that actually have published articles, with counts (taxonomy order). */
export function getAllCategories(): CategoryWithCount[] {
  const articles = getAllArticles();
  return CATEGORIES.map((c) => ({
    ...c,
    count: articles.filter((a) => a.category.slug === c.slug).length,
  })).filter((c) => c.count > 0);
}

/** The n latest published articles (for home/hub "featured" rails). */
export function getFeaturedArticles(n = 3): ArticleMeta[] {
  return getAllArticles().slice(0, n);
}

/**
 * Related articles for a given slug: same category, excluding self, newest
 * first. Falls back to backfilling with other recent articles so the rail is
 * never empty when a category is thin.
 */
export function getRelatedArticles(slug: string, n = 3): ArticleMeta[] {
  const all = getAllArticles();
  const current = all.find((a) => a.slug === slug);
  if (!current) return [];

  const sameCategory = all.filter(
    (a) => a.slug !== slug && a.category.slug === current.category.slug,
  );
  if (sameCategory.length >= n) return sameCategory.slice(0, n);

  const backfill = all.filter(
    (a) => a.slug !== slug && a.category.slug !== current.category.slug,
  );
  return [...sameCategory, ...backfill].slice(0, n);
}

/* ----------------------------------- Tags ---------------------------------- */

/** Published articles carrying a tag (by tag SLUG), newest first. */
export function getArticlesByTag(slug: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.tags.some((t) => tagSlug(t) === slug));
}

/**
 * Every tag in use, with counts, most-used first (ties alphabetical by label).
 * Raw spellings that slug to the same value are merged into one entry — see
 * tags.ts for why the slug, not the string, is the identity.
 */
export function getAllTags(): TagWithCount[] {
  const variants = new Map<string, string[]>();

  for (const article of getAllArticles()) {
    // Dedupe within an article so a repeated tag cannot inflate the count.
    const seen = new Set<string>();
    for (const tag of article.tags) {
      const slug = tagSlug(tag);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      const list = variants.get(slug);
      if (list) list.push(tag);
      else variants.set(slug, [tag]);
    }
  }

  return [...variants.entries()]
    .map(([slug, spellings]) => ({
      slug,
      label: tagLabel(spellings),
      count: spellings.length,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
