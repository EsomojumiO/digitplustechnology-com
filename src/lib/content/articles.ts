/**
 * articles.ts, Public access layer for Insights articles.
 *
 * PUBLIC API (the CMS seam, keep these signatures stable):
 *   getAllArticles(): ArticleMeta[]
 *   getArticleBySlug(slug): Article | null
 *   getArticlesByCategory(categorySlug): ArticleMeta[]
 *   getAllCategories(): CategoryWithCount[]
 *   getFeaturedArticles(n?): ArticleMeta[]
 *   getRelatedArticles(slug, n?): ArticleMeta[]
 *
 * Server-only (reads the filesystem at build time). Drafts are excluded from
 * every query here, there is no public path to a draft.
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
 * Returns null for missing OR draft articles, there is no public draft route.
 */
export function getArticleBySlug(slug: string): Article | null {
  const entry = readEntry(COLLECTION, slug);
  if (!entry) return null;
  const article = toArticle(entry);
  if (article.draft) return null;
  return article;
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
