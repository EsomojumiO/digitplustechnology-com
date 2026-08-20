/**
 * tags.ts, Tag slug/label helpers.
 *
 * Deliberately free of `server-only` and of any fs access so that client
 * islands (e.g. InsightsSearch) can import `tagSlug` too. The data-reading
 * counterparts — `getAllTags` / `getArticlesByTag` — live in articles.ts.
 *
 * Tags are free-text frontmatter and are NOT a controlled vocabulary the way
 * CATEGORIES is. They arrive case-inconsistent ("IT procurement" vs
 * "it procurement", "NDPR" vs "ndpr"), so the slug is the identity: slugging
 * merges the variants, and `tagLabel` picks which spelling to display.
 */

/** Canonical URL segment for a tag. Mirrors content-engine/lib/content.mjs. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Display label for a set of raw spellings that share one slug: the most
 * frequent variant wins, ties broken by first appearance so the result is
 * stable across builds.
 */
export function tagLabel(variants: string[]): string {
  const counts = new Map<string, number>();
  for (const v of variants) counts.set(v, (counts.get(v) ?? 0) + 1);

  let best = variants[0] ?? "";
  let bestCount = 0;
  for (const [variant, count] of counts) {
    if (count > bestCount) {
      best = variant;
      bestCount = count;
    }
  }
  return best;
}

/** A tag with the number of published articles carrying it. */
export interface TagWithCount {
  slug: string;
  label: string;
  count: number;
}

/**
 * Tags with fewer than this many articles are rendered `noindex` and kept out
 * of sitemap.xml — most of the ~130 tags sit on a single article, and shipping
 * ~100 thin archives would dilute the crawl budget for no gain.
 */
export const TAG_INDEX_THRESHOLD = 2;

/** The tag whose archive is surfaced at the prettier /insights/case-studies. */
export const CASE_STUDY_TAG_SLUG = "case-study";
