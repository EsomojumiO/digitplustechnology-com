/**
 * types.ts, Canonical content domain types + category taxonomy.
 *
 * This is the CMS SEAM. These types describe the shape of content as the rest
 * of the application consumes it. When MDX is swapped for a headless CMS
 * (Sanity/Payload, see docs/CMS-MIGRATION.md), the loader internals change but
 * THESE TYPES and the public function signatures in articles.ts / reports.ts
 * MUST stay stable. Pages depend only on these.
 *
 * Convention:
 *  - `*Meta` types describe a content item WITHOUT its rendered body, cheap to
 *    list (cards, grids, sitemaps).
 *  - The full type (`Article`, `Report`) extends the meta with the body + any
 *    expensive/computed fields, returned only for single-item detail pages.
 */

/* ---------------------------------------------------------------------------
   SEO, shared, per-item overrides. All fields optional; pages fall back to
   sensible defaults (title/excerpt) when a field is absent.
   --------------------------------------------------------------------------- */
export interface SeoMeta {
  /** Overrides the <title>. Falls back to the item title when absent. */
  metaTitle?: string;
  /** Overrides the meta description / OG description. Falls back to excerpt/summary. */
  metaDescription?: string;
  /** Absolute or root-relative path to a custom Open Graph image. */
  ogImage?: string;
}

/* ---------------------------------------------------------------------------
   Categories, the canonical taxonomy (brief §7). The slug is the URL segment
   used by /insights/[category]; the label is the human-facing name.

   This list is AUTHORITATIVE. Article frontmatter `category` must use one of
   these LABELS (editor-friendly). The loader maps label -> Category via
   `categoryFromLabel`. Adding a category = add one row here.
   --------------------------------------------------------------------------- */
export interface Category {
  /** URL-safe segment, e.g. "it-strategy-advisory". */
  slug: string;
  /** Human-facing label as written in frontmatter, e.g. "IT Strategy & Advisory". */
  label: string;
  /** One-line description for category archive pages / SEO. */
  description: string;
}

/** A Category enriched with how many published articles it contains. */
export interface CategoryWithCount extends Category {
  count: number;
}

export const CATEGORIES: readonly Category[] = [
  {
    slug: "it-strategy-advisory",
    label: "IT Strategy & Advisory",
    description:
      "Planning, budgeting, and roadmap thinking for IT decision-makers, turning technology spend into accountable outcomes.",
  },
  {
    slug: "infrastructure",
    label: "Infrastructure",
    description:
      "Structured cabling, networks, server rooms, and power, the physical foundations of reliable operations.",
  },
  {
    slug: "procurement",
    label: "Procurement",
    description:
      "Disciplined, documented IT sourcing, vendor accountability, LPO workflows, and audit-ready buying.",
  },
  {
    slug: "cybersecurity",
    label: "Cybersecurity",
    description:
      "Practical security posture for Nigerian enterprises and institutions, risk, resilience, and compliance.",
  },
  {
    slug: "managed-services",
    label: "Managed Services",
    description:
      "SLAs, monitoring, and support models that keep multi-site operations running.",
  },
  {
    slug: "industry-policy",
    label: "Industry & Policy",
    description:
      "How regulation, sector trends, and market shifts shape IT decisions for government, banking, and beyond.",
  },
  {
    slug: "guides",
    label: "Guides",
    description:
      "Step-by-step, vendor-neutral guidance for planning and running IT, strategy, not product selling.",
  },
] as const;

/* ---------------------------------------------------------------------------
   Articles (Insights). Frontmatter schema mirrors brief §7 exactly.
   --------------------------------------------------------------------------- */
export interface ArticleMeta {
  title: string;
  /** Must equal the filename (without .mdx). The canonical URL slug. */
  slug: string;
  excerpt: string;
  /** Resolved canonical category for this article. */
  category: Category;
  tags: string[];
  author: string;
  /** ISO 8601 string. */
  publishedAt: string;
  /** ISO 8601 string. Defaults to publishedAt when not supplied. */
  updatedAt: string;
  /** Root-relative path to the cover image, e.g. "/images/insights/<slug>.jpg". */
  cover: string;
  /** Required alt text for the cover (a11y + SEO). */
  coverAlt: string;
  /** When true the article is excluded from all public listings/queries. */
  draft: boolean;
  /** Computed at load time from the body via `reading-time`. */
  readingTime: ReadingTime;
  seo: SeoMeta;
}

/** A fully-loaded article including its raw MDX body, for detail pages. */
export interface Article extends ArticleMeta {
  /** Raw MDX source string, render with the <MDXContent /> wrapper. */
  body: string;
}

export interface ReadingTime {
  /** Estimated minutes, rounded up, e.g. 7. */
  minutes: number;
  /** Human label, e.g. "7 min read". */
  text: string;
  /** Word count of the body. */
  words: number;
}

/* ---------------------------------------------------------------------------
   Reports (quarterly downloadables). Frontmatter schema mirrors brief §8.
   --------------------------------------------------------------------------- */
export interface ReportMeta {
  title: string;
  /** Must equal the filename (without .mdx). */
  slug: string;
  /** e.g. "Q2", calendar quarter the report covers. */
  quarter: string;
  /** e.g. 2026. */
  year: number;
  /** Root-relative path to the cover image. */
  cover: string;
  coverAlt: string;
  /** Short teaser shown on the hub + as meta description fallback. */
  summary: string;
  /** Ungated, indexable preview bullets. */
  keyFindings: string[];
  /** Root-relative path to the gated PDF, e.g. "/reports/<slug>.pdf". */
  pdf: string;
  /** ISO 8601 string. */
  publishedAt: string;
  /** When true, shown only in the archive, never as featured/latest. */
  archived: boolean;
  seo: SeoMeta;
}

/** A fully-loaded report including its ungated narrative body. */
export interface Report extends ReportMeta {
  /** Raw MDX source string for the ungated preview narrative. */
  body: string;
}

/* ---------------------------------------------------------------------------
   Taxonomy helpers, the single mapping point between editor-facing labels and
   URL slugs. Used by the loader and by category archive pages.
   --------------------------------------------------------------------------- */

/** Return the full canonical category list (unfiltered). */
export function getCategories(): readonly Category[] {
  return CATEGORIES;
}

/** Resolve a frontmatter label (case-insensitive) to a Category, or null. */
export function categoryFromLabel(label: string): Category | null {
  const needle = label.trim().toLowerCase();
  return (
    CATEGORIES.find((c) => c.label.toLowerCase() === needle) ?? null
  );
}

/** Resolve a URL slug to a Category, or null. */
export function categoryFromSlug(slug: string): Category | null {
  const needle = slug.trim().toLowerCase();
  return CATEGORIES.find((c) => c.slug === needle) ?? null;
}
