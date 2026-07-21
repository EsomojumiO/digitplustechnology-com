/**
 * data/types.ts, Shared shapes for the marketing copy layer.
 *
 * This is editorial copy (owned by pages-builder), kept separate from the
 * canonical slug/NAP config in `src/lib/site.ts`. Slugs referenced here MUST
 * match `ServiceSlug` / `IndustrySlug` from site.ts.
 */
import type { ServiceSlug, IndustrySlug } from "@/lib/site";

export type { ServiceSlug, IndustrySlug };

/** A simple title + description pair, used for feature/concern lists. */
export interface TitledItem {
  title: string;
  desc: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface ServiceContent {
  slug: ServiceSlug;
  title: string;
  tagline: string;
  /** 1–2 paragraphs of intro copy. */
  intro: string[];
  /** The four sub-capabilities from the brief. */
  whatsIncluded: TitledItem[];
  /** Ordered delivery steps for this service. */
  howItWorks: string[];
  /** Industries this service is most relevant to. */
  relevantIndustries: IndustrySlug[];
  faqs: FAQ[];
  metaTitle: string;
  metaDescription: string;
}

/**
 * Sector names can't be bent into sentences by interpolation. `title` is a
 * display label ("SME", "Oil, Gas & Energy", "Banking & Financial Services"),
 * and the page used to build headings and CTAs from `title.toLowerCase()`.
 * That shipped "Talk to a sme specialist", "Talk to a education specialist",
 * "Talk to a oil, gas & energy specialist" and "What banking & financial
 * services demands" — on all 8 industry pages, in 3 slots each. Lowercasing
 * destroys the acronym, and no template can fix a/an agreement or subject-verb
 * agreement across these names.
 *
 * So the three sentence positions are written out per sector instead of
 * derived. Editors control the exact wording; nothing is guessed at runtime.
 */
export interface IndustryPhrasing {
  /** Follows "Talk to " and precedes " specialist" — carries its own article. */
  specialist: string;
  /** Complete H2 for the concerns section. */
  demandsHeading: string;
  /** Complete H2 for the closing CTA band. */
  ctaHeading: string;
}

export interface IndustryContent {
  slug: IndustrySlug;
  title: string;
  /** Grammatically correct sentence forms for this sector. See IndustryPhrasing. */
  phrasing: IndustryPhrasing;
  intro: string[];
  /** Sector-specific concerns we address. */
  concerns: TitledItem[];
  /** Services most relevant to this sector. */
  relevantServices: ServiceSlug[];
  faqs?: FAQ[];
  metaTitle: string;
  metaDescription: string;
}

export type TestimonialSource = "google-review" | "direct";

export interface TestimonialContent {
  /** Verbatim. For google-review the ONLY permitted edit is truncation with "…". */
  quote: string;
  name: string;
  title?: string;
  company?: string;
  source: TestimonialSource;
  /**
   * google-review: true — already published by its author.
   * direct: true ONLY once the named person has approved in writing.
   * Enforced in data/testimonials.ts, which exports pre-filtered lists.
   */
  approved: boolean;
}

export interface ProcessStepContent {
  step: number;
  title: string;
  description: string;
}

export interface StatContent {
  value: string;
  label: string;
}

export interface WhyUsPillar {
  title: string;
  description: string;
}
