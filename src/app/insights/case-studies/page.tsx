import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByTag, CASE_STUDY_TAG_SLUG } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ArchiveView } from "../_components/ArchiveView";

/**
 * Case studies, /insights/case-studies
 *
 * An alias for the "case study" TAG, not a category. Category is topical
 * (Procurement / Infrastructure / Cybersecurity) and a case study can be any
 * of those — format belongs in tags. This route exists because the tag is
 * worth a clean, linkable URL; it is the canonical one, and
 * /insights/tag/case-study redirects here (next.config.ts).
 */
const LEDE =
  "Real deployments, with the specification decisions, the constraints we designed around and what they cost. Client names are withheld; the engineering is not.";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies",
  description:
    "Deployment case studies from Digitplus Technology — hospital IT procurement, managed devices for a law practice, and a solar-powered rural school computer lab.",
  path: "/insights/case-studies",
});

export default function CaseStudiesPage() {
  const articles = getArticlesByTag(CASE_STUDY_TAG_SLUG);
  if (articles.length === 0) notFound();

  return (
    <ArchiveView
      title="Case Studies"
      eyebrow="Format"
      lede={LEDE}
      articles={articles}
    />
  );
}
