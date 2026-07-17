/**
 * data/testimonials.ts — PLACEHOLDER testimonials.
 *
 * These are SAFE placeholders: realistic quote text with ROLE-BASED attributions
 * only — no invented person or company names. Replace with real, attributable,
 * client-approved testimonials before launch.
 * Tracked in PLACEHOLDERS.md (repo root) and docs/BLOCKERS.md.
 */
import type { TestimonialContent } from "./types";

export const testimonials: TestimonialContent[] = [
  // PLACEHOLDER — replace with client data (real, attributable, approved quote + attribution)
  {
    quote:
      "Digitplus handled procurement and deployment across three of our locations without us having to chase a single vendor. The documentation alone made our audit far easier.",
    author: "Operations Director",
    role: "Operations Director",
    organization: "Abuja financial services firm",
  },
  // PLACEHOLDER — replace with client data (real, attributable, approved quote + attribution)
  {
    quote:
      "What stood out was accountability. One partner owned the whole rollout, supply, cabling, configuration, training, and stood behind it afterwards.",
    author: "Head of IT",
    role: "Head of IT",
    organization: "Lagos manufacturing group",
  },
  // PLACEHOLDER — replace with client data (real, attributable, approved quote + attribution)
  {
    quote:
      "As a growing business we needed straight answers, not jargon. They right-sized what we bought and the support has been dependable ever since.",
    author: "Managing Director",
    role: "Managing Director",
    organization: "Port Harcourt SME",
  },
];

export default testimonials;
