/**
 * data/testimonials.ts — real testimonials.
 *
 * THE RULE: never publish words a person didn't write or approve.
 *
 * - `source: "google-review"` — already published publicly by its author on
 *   Google. Quotable verbatim, no approval needed. Quote EXACTLY; the only
 *   permitted edit is truncation with "…".
 * - `source: "direct"` — a draft WE wrote and sent for approval. It is not a
 *   testimonial until the named person approves it in writing. `approved: false`
 *   until that reply exists, and the consent record (screenshot/email) is kept.
 *
 * `approved` is enforced by construction, not convention: the exports below are
 * pre-filtered and the raw array is module-private, so an unapproved quote has
 * no code path to a page. Forgetting to filter at a call site can't publish one.
 */
import type { TestimonialContent } from "./types";

const all: TestimonialContent[] = [
  /* ---- Google reviews — public, verbatim, approved by publication ----------
     These read as retail/hardware-store reviews. They support the hardware-supply
     line honestly; they do NOT speak to managed-services enterprise positioning,
     which is why they render as a supporting strip and not as the main cards. */
  {
    quote: "Great store for high-end computing systems",
    name: "Dapo Nasir",
    source: "google-review",
    approved: true,
  },
  {
    quote: "Excellent customer service and they deliver up to their reputation",
    name: "Ibrahim",
    source: "google-review",
    approved: true,
  },
  {
    quote:
      "Very good at sourcing components and building your computer very quickly",
    name: "Othman Tofa",
    source: "google-review",
    approved: true,
  },
  {
    quote:
      "I liked these people and I haven't had to return anything bought. They're good at what they do.",
    name: "Emmanuel Aliyu",
    source: "google-review",
    approved: true,
  },
  {
    quote: "Good service delivery and quality products",
    name: "Praise-God Muagba",
    source: "google-review",
    approved: true,
  },

  /* ---- Direct testimonials — DRAFTS AWAITING WRITTEN APPROVAL --------------
     Each is a suggestion we drafted, NOT something the person said. Flip
     `approved` to true only on confirmation that the named person approved in
     writing — and publish what came back, not what's written below. */

  // PENDING APPROVAL — Adel Salimullin (draft sent; awaiting written reply)
  {
    quote:
      "DigitPlus has handled our IT infrastructure needs with a level of professionalism that's rare to find. Procurement is fast, the equipment is genuine, and their team understands what an organisation like ours cannot afford to have go down. They've earned our trust.",
    name: "Adel Salimullin",
    title: "CTO",
    company: "Nizamiye",
    source: "direct",
    approved: false,
  },

  // PENDING APPROVAL — Arc. Henshaw (draft sent; awaiting written reply)
  {
    quote:
      "From workstations to networking, DigitPlus equipped our practice end to end. They recommended what we actually needed rather than what was expensive, delivered on schedule, and have been responsive every time we've called since.",
    name: "Arc. Henshaw",
    company: "Greyboulders",
    source: "direct",
    approved: false,
  },

  // PENDING APPROVAL — Bashir Lawal (draft sent; awaiting written reply)
  {
    quote:
      "Broadcast work doesn't forgive downtime. DigitPlus sourced and set up our systems quickly, and their after-sales support has kept us running without drama. Dependable people.",
    name: "Bashir Lawal",
    company: "DewDrop TV",
    source: "direct",
    approved: false,
  },
];

/** Everything cleared to publish. The only export of the full set. */
export const testimonials: TestimonialContent[] = all.filter((t) => t.approved);

/** Public Google reviews — the supporting ★★★★★ strip. */
export const googleReviews: TestimonialContent[] = testimonials.filter(
  (t) => t.source === "google-review",
);

/** Approved direct testimonials — the main cards. EMPTY until approvals land. */
export const directTestimonials: TestimonialContent[] = testimonials.filter(
  (t) => t.source === "direct",
);

/** Drafts still awaiting approval. For reporting only — never rendered. */
export const pendingApprovalCount = all.filter(
  (t) => t.source === "direct" && !t.approved,
).length;

export default testimonials;
