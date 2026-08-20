import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllTags,
  getArticlesByTag,
  TAG_INDEX_THRESHOLD,
  CASE_STUDY_TAG_SLUG,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ArchiveView } from "../../_components/ArchiveView";

/**
 * Tag archive, /insights/tag/[tag]
 *
 * ROUTING NOTE: same constraint as the category archive — Next forbids two
 * differently-named dynamic segments at one level, and /insights/[slug] is
 * already taken by articles, so tag archives nest under /insights/tag/.
 *
 * INDEXING: tags are free-text, and most sit on a single article. Every tag
 * gets a working page (so the badges on an article are always clickable), but
 * thin ones are marked noindex,follow and kept out of sitemap.xml — see
 * TAG_INDEX_THRESHOLD in lib/content/tags.ts.
 *
 * The "case study" tag is excluded here: it is served from the prettier
 * /insights/case-studies, and /insights/tag/case-study 308s there
 * (next.config.ts redirects).
 */
function indexableTags() {
  return getAllTags().filter((t) => t.slug !== CASE_STUDY_TAG_SLUG);
}

export function generateStaticParams() {
  return indexableTags().map((t) => ({ tag: t.slug }));
}

export const dynamicParams = false;

function describe(label: string, count: number): string {
  return `${count} ${count === 1 ? "article" : "articles"} on ${label} from the Digitplus Insights library — practical guidance for Nigerian IT decision-makers.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = getAllTags().find((t) => t.slug === slug);
  if (!tag) return { title: "Insights" };

  return buildMetadata({
    title: `${tag.label} Insights`,
    description: describe(tag.label, tag.count),
    path: `/insights/tag/${tag.slug}`,
    noindex: tag.count < TAG_INDEX_THRESHOLD,
  });
}

export default async function TagArchivePage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: slug } = await params;
  const tag = getAllTags().find((t) => t.slug === slug);
  if (!tag) notFound();

  const articles = getArticlesByTag(tag.slug);
  if (articles.length === 0) notFound();

  return (
    <ArchiveView
      title={tag.label}
      eyebrow="Tag"
      lede={describe(tag.label, tag.count)}
      articles={articles}
    />
  );
}
