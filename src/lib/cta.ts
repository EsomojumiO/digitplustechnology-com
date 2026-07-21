/**
 * Canonical CTA labels — one intent, one label, sitewide.
 *
 * The old site used "Get a quote" on every page regardless of intent. Enterprise
 * buyers don't buy quotes, and a single label everywhere is a missed chance to
 * match the page. Each page type now has ONE primary intent with ONE label; the
 * conformance gate reads this map and flags any rendered CTA that doesn't match
 * (and any lingering "Get a quote").
 *
 * Keep this the single source of truth — pages import from here, they don't
 * hand-write CTA strings.
 */
export const ctaLabels = {
  /** Service detail — enterprise buyers buy proposals, not quotes. */
  serviceProposal: "Request a proposal",
  /** Contact — the form is a project brief. */
  contactBrief: "Send your brief",
  /** Insights / articles — soft, routes to the relevant service pillar. */
  insightsSoft: "Get this working in your business",
  /** Footer band + generic pages (about, approach, ecosystem, 404, index hubs). */
  generic: "Start a conversation",
  /** Home hero conversion slide (already wired in HeroCarousel). */
  heroProposal: "Get a proposal",
} as const;

/**
 * Industry detail — "Talk to a government specialist", "Talk to an SME
 * specialist", etc. Takes the sector's own `phrasing.specialist`, which
 * CARRIES ITS OWN ARTICLE ("a government", "an SME"). Do not pass a bare
 * sector name or a lowercased title: that is what produced "Talk to a sme
 * specialist" and "Talk to a education specialist" on the shipped site.
 */
export const industrySpecialist = (sectorWithArticle: string) =>
  `Talk to ${sectorWithArticle} specialist`;

/** Location detail — "Reach our Abuja office", etc. */
export const officeCta = (city: string) => `Reach our ${city} office`;

/**
 * The full set of exact labels the conformance gate accepts as primary CTAs.
 * Function-generated ones (specialist/office) are matched by prefix in the gate.
 */
export const allCtaLabels = Object.values(ctaLabels);
