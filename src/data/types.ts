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

export interface IndustryContent {
  slug: IndustrySlug;
  title: string;
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
