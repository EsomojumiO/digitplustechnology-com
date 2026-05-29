/**
 * index.ts — Barrel for the content access layer.
 *
 * Pages should import from "@/lib/content" only. This is the stable public
 * surface; the file structure behind it (source.ts, MDX vs CMS) may change.
 *
 *   import {
 *     getAllArticles, getArticleBySlug, getRelatedArticles,
 *     getAllReports, getReportBySlug, getFeaturedReport,
 *     MDXContent, getCategories,
 *   } from "@/lib/content";
 */

// Types + taxonomy
export type {
  Article,
  ArticleMeta,
  Report,
  ReportMeta,
  Category,
  CategoryWithCount,
  ReadingTime,
  SeoMeta,
} from "./types";
export {
  CATEGORIES,
  getCategories,
  categoryFromLabel,
  categoryFromSlug,
} from "./types";

// Articles
export {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getAllCategories,
  getFeaturedArticles,
  getRelatedArticles,
} from "./articles";

// Reports
export {
  getAllReports,
  getReportBySlug,
  getFeaturedReport,
  getArchivedReports,
} from "./reports";

// MDX rendering wrapper (server component)
export { MDXContent, type MDXContentProps } from "./mdx";
