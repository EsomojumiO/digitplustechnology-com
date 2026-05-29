/**
 * data/testimonials.ts — Illustrative testimonials.
 *
 * NOTE: These are ILLUSTRATIVE placeholders, not attributable quotes. They must
 * be replaced with real, attributable client testimonials before launch. This
 * is tracked in docs/BLOCKERS.md.
 */
import type { TestimonialContent } from "./types";

export const testimonials: TestimonialContent[] = [
  {
    quote:
      "Digitplus handled procurement and deployment across three of our locations without us having to chase a single vendor. The documentation alone made our audit far easier.",
    author: "Operations Director",
    role: "Operations Director",
    organization: "Federal agency (illustrative)",
  },
  {
    quote:
      "What stood out was accountability. One partner owned the whole rollout — supply, cabling, configuration, training — and stood behind it afterwards.",
    author: "Head of IT",
    role: "Head of IT",
    organization: "Commercial bank (illustrative)",
  },
  {
    quote:
      "As a growing business we needed straight answers, not jargon. They right-sized what we bought and the support has been dependable ever since.",
    author: "Managing Director",
    role: "Managing Director",
    organization: "SME, Lagos (illustrative)",
  },
];

export default testimonials;
