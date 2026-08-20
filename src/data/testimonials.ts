/**
 * data/testimonials.ts — real testimonials.
 *
 * THE RULE: never publish words a person didn't write or approve.
 *
 * - `source: "google-review"` — already published publicly by its author on
 *   Google. Quotable verbatim, no approval needed. Quote EXACTLY; the only
 *   permitted edit is truncation with "…".
 * - `source: "direct"` — a draft WE wrote for approval. It is not a
 *   testimonial until the named person approves it in writing. `approved: false`
 *   until that reply exists, and the consent record (screenshot/email) is kept.
 *
 * `approved` is enforced by construction, not convention: the exports below are
 * pre-filtered and the raw array is module-private, so an unapproved quote has
 * no code path to a page. Forgetting to filter at a call site can't publish one.
 *
 * And `approved: true` cannot be set alone — the type requires `approvedBy` and
 * `approvedDate` alongside it, so the consent record travels with the quote and
 * the BUILD FAILS if someone flips the flag without one. See isPublishable().
 */
import type { ApprovedTestimonial, TestimonialContent } from "./types";

/**
 * The five Google reviews share one consent basis: the author published the
 * words publicly themselves on the verified profile, so no further permission
 * is needed. Captured and verified from that profile on this date (commit
 * 47ecd3c; profile URL verified in PLACEHOLDERS.md). This is the capture date,
 * NOT the date each author originally posted — Google does not expose that.
 */
const GOOGLE_REVIEW_CONSENT = {
  approvedBy:
    "Author — self-published on the public Google profile (siteConfig.googleReviewsUrl)",
  approvedDate: "2026-07-17",
} as const;

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
    ...GOOGLE_REVIEW_CONSENT,
  },
  {
    quote: "Excellent customer service and they deliver up to their reputation",
    name: "Ibrahim",
    source: "google-review",
    approved: true,
    ...GOOGLE_REVIEW_CONSENT,
  },
  {
    quote:
      "Very good at sourcing components and building your computer very quickly",
    name: "Othman Tofa",
    source: "google-review",
    approved: true,
    ...GOOGLE_REVIEW_CONSENT,
  },
  {
    quote:
      "I liked these people and I haven't had to return anything bought. They're good at what they do.",
    name: "Emmanuel Aliyu",
    source: "google-review",
    approved: true,
    ...GOOGLE_REVIEW_CONSENT,
  },
  {
    quote: "Good service delivery and quality products",
    name: "Praise-God Muagba",
    source: "google-review",
    approved: true,
    ...GOOGLE_REVIEW_CONSENT,
  },

  /* ---- Direct testimonials — DRAFTS AWAITING WRITTEN APPROVAL --------------
     Each is a suggestion we drafted, NOT something the person said. Flip
     `approved` to true only on confirmation that the named person approved in
     writing — and publish what came back, not what's written below. */

  // PENDING APPROVAL — draft written; send status unconfirmed — see PLACEHOLDERS.md
  // Identity withheld here to match the anonymised hospital case study. The
  // real name and employer are tracked in PLACEHOLDERS.md ("PENDING — 3 direct
  // testimonials"); restore them here only alongside written approval.
  {
    quote:
      "DigitPlus has handled our IT infrastructure needs with a level of professionalism that's rare to find. Procurement is fast, the equipment is genuine, and their team understands what an organisation like ours cannot afford to have go down. They've earned our trust.",
    name: "Withheld pending approval",
    title: "CTO",
    company: "Private hospital, Abuja",
    source: "direct",
    approved: false,
  },

  // PENDING APPROVAL — Arc. Henshaw (draft written; send status unconfirmed — see PLACEHOLDERS.md)
  {
    quote:
      "From workstations to networking, DigitPlus equipped our practice end to end. They recommended what we actually needed rather than what was expensive, delivered on schedule, and have been responsive every time we've called since.",
    name: "Arc. Henshaw",
    company: "Greyboulders",
    source: "direct",
    approved: false,
  },

  // PENDING APPROVAL — Bashir Lawal (draft written; send status unconfirmed — see PLACEHOLDERS.md)
  {
    quote:
      "Broadcast work doesn't forgive downtime. DigitPlus sourced and set up our systems quickly, and their after-sales support has kept us running without drama. Dependable people.",
    name: "Bashir Lawal",
    company: "DewDrop TV",
    source: "direct",
    approved: false,
  },
];

/**
 * THE PUBLISH GATE.
 *
 * `approved: true` on its own is not enough to ship a quote: it must also
 * carry WHO cleared it and WHEN. The type already makes that a compile-time
 * requirement (ApprovedTestimonial), so this runtime check is the second belt
 * — it catches a malformed record arriving from outside the type system, which
 * is exactly what happens the day these move to a CMS. A quote that fails the
 * check is dropped silently rather than published; there is no path where
 * missing consent still renders.
 */
function isPublishable(t: TestimonialContent): t is ApprovedTestimonial {
  if (!t.approved) return false;
  if (typeof t.approvedBy !== "string" || t.approvedBy.trim() === "")
    return false;
  if (typeof t.approvedDate !== "string") return false;
  // Real calendar date in YYYY-MM-DD — not just something shaped like one.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.approvedDate)) return false;
  const parsed = new Date(`${t.approvedDate}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === t.approvedDate
  );
}

/** Everything cleared to publish. The only export of the full set. */
export const testimonials: ApprovedTestimonial[] = all.filter(isPublishable);

/** Public Google reviews — the supporting ★★★★★ strip. */
export const googleReviews: ApprovedTestimonial[] = testimonials.filter(
  (t) => t.source === "google-review",
);

/** Approved direct testimonials — the main cards. EMPTY until approvals land. */
export const directTestimonials: ApprovedTestimonial[] = testimonials.filter(
  (t) => t.source === "direct",
);

/** Drafts still awaiting approval. For reporting only — never rendered. */
export const pendingApprovalCount = all.filter(
  (t) => t.source === "direct" && !t.approved,
).length;

export default testimonials;
