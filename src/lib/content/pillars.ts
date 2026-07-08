/**
 * pillars.ts — hub-and-spoke map (docs/redesign/07-seo-architecture.md §3).
 *
 * Each published article links UP to exactly one pillar page (a service, or an
 * industry for the sector Guides); pillar pages link back to their spoke
 * articles ("further reading"). Kept as one central map so we don't touch 33
 * MDX files; add a row when a new article ships.
 */
import { services, industries } from "@/lib/site";
import { getAllArticles } from "./articles";
import type { ArticleMeta } from "./types";

type PillarKind = "service" | "industry";

/** articleSlug -> pillar. `kind` selects the /services or /industries space. */
const ARTICLE_PILLAR: Record<string, { kind: PillarKind; slug: string }> = {
  // it-procurement
  "complete-guide-to-it-procurement-in-nigeria": { kind: "service", slug: "it-procurement" },
  "audit-ready-it-procurement-for-government": { kind: "service", slug: "it-procurement" },
  "consolidated-vs-reactive-it-purchasing": { kind: "service", slug: "it-procurement" },
  "how-the-lpo-process-works-for-public-sector-it": { kind: "service", slug: "it-procurement" },
  "how-to-evaluate-it-vendors-in-nigeria": { kind: "service", slug: "it-procurement" },
  // infrastructure-solutions
  "designing-a-server-room-power-cooling-ups": { kind: "service", slug: "infrastructure-solutions" },
  "structured-cabling-standards-for-nigerian-offices": { kind: "service", slug: "infrastructure-solutions" },
  "lan-wan-design-for-multi-branch-businesses": { kind: "service", slug: "infrastructure-solutions" },
  "network-installation-checklist-new-office": { kind: "service", slug: "infrastructure-solutions" },
  "power-protection-and-ups-planning": { kind: "service", slug: "infrastructure-solutions" },
  "budgeting-bank-branch-infrastructure": { kind: "service", slug: "infrastructure-solutions" },
  "securing-multi-branch-networks": { kind: "service", slug: "infrastructure-solutions" },
  // managed-services
  "what-an-it-sla-should-cover": { kind: "service", slug: "managed-services" },
  "proactive-it-monitoring-explained": { kind: "service", slug: "managed-services" },
  "in-house-vs-outsourced-it-support-nigeria": { kind: "service", slug: "managed-services" },
  "it-support-for-multi-site-operations": { kind: "service", slug: "managed-services" },
  "ransomware-readiness-for-nigerian-organisations": { kind: "service", slug: "managed-services" },
  "cybersecurity-essentials-for-nigerian-smes": { kind: "service", slug: "managed-services" },
  "ndpr-compliance-for-it-teams": { kind: "service", slug: "managed-services" },
  // technology-advisory
  "aligning-it-strategy-with-business-growth": { kind: "service", slug: "technology-advisory" },
  "how-to-build-a-three-year-it-roadmap": { kind: "service", slug: "technology-advisory" },
  "it-budgeting-for-nigerian-enterprises": { kind: "service", slug: "technology-advisory" },
  "refresh-or-repair-it-hardware-decision": { kind: "service", slug: "technology-advisory" },
  "structuring-a-multi-site-it-refresh": { kind: "service", slug: "technology-advisory" },
  "nigeria-enterprise-it-trends-2026": { kind: "service", slug: "technology-advisory" },
  "it-infrastructure-and-nigerias-digital-economy": { kind: "service", slug: "technology-advisory" },
  "powering-it-through-nigerias-energy-challenges": { kind: "service", slug: "technology-advisory" },
  "what-the-ndpr-means-for-nigerian-businesses": { kind: "service", slug: "technology-advisory" },
  // sector Guides -> industry pillars
  "it-checklist-for-opening-a-new-bank-branch": { kind: "industry", slug: "banking-financial-services" },
  "it-for-oil-gas-and-energy-operations": { kind: "industry", slug: "oil-gas-energy" },
  "it-infrastructure-for-schools-and-universities": { kind: "industry", slug: "education" },
  "it-readiness-checklist-for-government-agencies": { kind: "industry", slug: "government" },
  "it-setup-guide-for-hospitals-and-clinics": { kind: "industry", slug: "healthcare" },
};

export interface PillarRef {
  kind: PillarKind;
  slug: string;
  title: string;
  href: string;
}

function resolvePillar(kind: PillarKind, slug: string): PillarRef | null {
  const source = kind === "service" ? services : industries;
  const match = source.find((s) => s.slug === slug);
  if (!match) return null;
  return {
    kind,
    slug,
    title: match.title,
    href: `/${kind === "service" ? "services" : "industries"}/${slug}`,
  };
}

/** The single pillar an article links up to (null if unmapped). */
export function getPillarForArticle(articleSlug: string): PillarRef | null {
  const entry = ARTICLE_PILLAR[articleSlug];
  return entry ? resolvePillar(entry.kind, entry.slug) : null;
}

/** Spoke articles for a pillar page ("further reading"), most recent first. */
export function getSpokeArticles(
  kind: PillarKind,
  slug: string,
  n = 5,
): ArticleMeta[] {
  return getAllArticles()
    .filter((a) => {
      const p = ARTICLE_PILLAR[a.slug];
      return p && p.kind === kind && p.slug === slug;
    })
    .slice(0, n);
}
