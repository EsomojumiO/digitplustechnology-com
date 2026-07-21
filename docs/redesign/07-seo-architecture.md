# 07 — SEO & Information Architecture (Agent 1) — APPROVAL REQUIRED

_Branch `redesign/dark-raycast`. Goal: rank for commercial-intent Nigerian enterprise-IT queries and convert visits to leads. Read from the repo — services/industries/locations/articles are real, nothing invented. **SEO plumbing (metadata, JSON-LD, sitemap, canonicals, redirects) is updated coherently, never removed.**_

## 1. Keyword → page map (one primary query per page)

### Commercial pillars — Services
| URL | Primary query (head) | Secondary / long-tail | Source of substance |
|---|---|---|---|
| `/` | **enterprise IT solutions company in Nigeria** | "IT solutions Nigeria", "B2B IT company Nigeria" | siteConfig |
| `/services` | IT services for business in Nigeria | "IT services company Nigeria" | hub |
| `/services/it-procurement` | **IT procurement company in Nigeria** | "LPO IT supply", "audit-ready IT procurement" | services.ts |
| `/services/hardware-supply` | IT hardware supplier in Nigeria | "server & networking hardware Nigeria", "genuine warrantied hardware" | services.ts |
| `/services/infrastructure-solutions` | IT infrastructure company in Nigeria | "structured cabling Nigeria", "network installation company Abuja/Lagos" | services.ts |
| `/services/managed-services` | **managed IT services in Nigeria** | "enterprise IT support SLA", "outsourced IT support Nigeria" | services.ts |
| `/services/technology-advisory` | IT consulting & advisory Nigeria | "IT strategy Nigeria", "IT roadmap / budgeting" | services.ts |
| `/services/deployment-implementation` | IT deployment & implementation Nigeria | "IT installation & rollout Nigeria" | services.ts |

### Sector intent — Industries (queries already encoded in `metaTitle`)
`government`, `banking-financial-services`, `enterprise`, `sme`, `healthcare`, `education`, `oil-gas-energy`, `logistics-manufacturing` → each targets **"IT solutions for [sector] in Nigeria"** (one primary query per page; no overlap with service queries).

### Local intent — Locations
| URL | Primary query | Local substance (real, from locations.ts) |
|---|---|---|
| `/locations/abuja` | **IT company in Abuja** | HQ; federal MDAs; LPO/audit procurement |
| `/locations/lagos` | IT company in Lagos | commercial hub; bank branches; multi-site |
| `/locations/port-harcourt` | IT company in Port Harcourt | South-South; oil/gas resilience |

## 2. Location × service — anti-duplication decision (client's explicit rule)

**Recommendation: DO NOT mass-generate service×city combo pages (would be 6×3 = 18 near-duplicate doorway pages).** The repo has **no local case studies, testimonials, or local team bios yet** (tracked in `docs/BLOCKERS.md`), so combo pages would be thin templated duplicates — exactly what the rule forbids, and a Google "doorway pages" risk.

**Instead (Phase C):**
- Strengthen the **3 location pages** to carry genuine local substance + **interlink** to the services most relevant to that city (Abuja→procurement/advisory; Lagos→managed/infrastructure; PH→infrastructure/managed).
- Every **service page names all three cities** and links to the location pages (captures "network installation Abuja"-style long-tail without new URLs).
- **City+service head terms** are served by this service↔location interlink mesh, not by dedicated URLs.

**Optional, only if the client later supplies real local proof:** up to **3** high-substance combos where city and flagship sector genuinely align — `abuja + it-procurement` (government), `lagos + managed-services` (banking branches), `port-harcourt + infrastructure-solutions` (energy resilience). URL pattern `/services/[service]/[city]`, self-canonical, unique local copy + local proof block. **Deferred pending assets — flagged, not built now.**

**Self-check to run in Agent 6:** shingle-similarity across all commercial pages; any pair > 40% textual similarity → consolidate + 301 + canonical. (Current risk area: service pages that repeat the same "single accountable partner" boilerplate — the Copy Chief cut addresses this.)

## 3. Hub-and-spoke internal linking (all 33 articles mapped to one pillar)

Article **category → pillar**: Procurement→`it-procurement`, Infrastructure→`infrastructure-solutions`, Managed Services→`managed-services`, IT Strategy & Advisory→`technology-advisory`, Cybersecurity→`managed-services` (security monitoring) unless network-specific→`infrastructure-solutions`, Guides→relevant **industry** pillar, Industry & Policy→`technology-advisory` or relevant industry.

| Pillar | Spoke articles (link UP with descriptive anchors; pillar links to 3–5 back) |
|---|---|
| **it-procurement** | complete-guide-to-it-procurement-in-nigeria · audit-ready-it-procurement-for-government · consolidated-vs-reactive-it-purchasing · how-the-lpo-process-works-for-public-sector-it · how-to-evaluate-it-vendors-in-nigeria |
| **infrastructure-solutions** | designing-a-server-room-power-cooling-ups · structured-cabling-standards-for-nigerian-offices · lan-wan-design-for-multi-branch-businesses · network-installation-checklist-new-office · power-protection-and-ups-planning · budgeting-bank-branch-infrastructure · securing-multi-branch-networks |
| **managed-services** | what-an-it-sla-should-cover · proactive-it-monitoring-explained · in-house-vs-outsourced-it-support-nigeria · it-support-for-multi-site-operations · ransomware-readiness-for-nigerian-organisations · cybersecurity-essentials-for-nigerian-smes · securing-multi-branch-networks |
| **technology-advisory** | aligning-it-strategy-with-business-growth · how-to-build-a-three-year-it-roadmap · it-budgeting-for-nigerian-enterprises · refresh-or-repair-it-hardware-decision · structuring-a-multi-site-it-refresh · nigeria-enterprise-it-trends-2026 |
| **hardware-supply** | refresh-or-repair-it-hardware-decision (shared) · budgeting-bank-branch-infrastructure (shared) |
| **deployment-implementation** | structuring-a-multi-site-it-refresh (shared) · network-installation-checklist-new-office (shared) |
| **Industry pillars** | Guides map to sectors: it-checklist-for-opening-a-new-bank-branch→banking · it-for-oil-gas-and-energy-operations→oil-gas-energy · it-infrastructure-for-schools-and-universities→education · it-setup-guide-for-hospitals-and-clinics→healthcare · it-readiness-checklist-for-government-agencies→government |
| **Policy** (compliance) | ndpr-compliance-for-it-teams · what-the-ndpr-means-for-nigerian-businesses · it-infrastructure-and-nigerias-digital-economy · powering-it-through-nigerias-energy-challenges → link from `technology-advisory` + relevant industry |

Implementation: add a "Related service" up-link block to each article (data-driven from this map, stored in `src/lib/content` or article frontmatter `pillar:`), and a "Further reading" 3–5 spoke list on each pillar. No article body rewrites (they're SEO assets).

## 4. Lead-generation architecture

**Every commercial page (home, service, industry, location):**
1. **Primary CTA above the fold** — "Get a quote" → short form (or `/contact#quote`). Orange, one per screen.
2. **Phone clickable** in nav + footer — `tel:+2348037868120`.
3. **WhatsApp Business CTA** — a `wa.me/2348037868120` deep link, not a scripted chat widget. **The floating button was removed 2026-07-22 at the client's request**: WhatsApp must not be the most visible contact option on an enterprise B2B site. It remains in the header Contact dropdown, the footer, and /contact. ✅ compliant.
4. **Proof block before the first CTA** — partner logos (TrustMarquee) / stats band. _Note: partner-logo reseller authorization + real testimonials remain client blockers._
5. **Contact form ≤ 5 fields** — audit `ContactForm`; trim to Name, Company, Email, Phone, Message (drop anything beyond). Honeypot stays (not a counted field).

**Conversion event per page type:**
| Page type | Primary conversion | Secondary |
|---|---|---|
| Home | quote form submit | WhatsApp click |
| Service | quote form submit (service pre-filled) | phone / WhatsApp |
| Industry | quote form submit (sector context) | WhatsApp |
| Location | quote form submit / phone (local intent) | WhatsApp |
| Insights article | newsletter signup + pillar CTA | related-service click |
| Report | gated download (report-lead) | newsletter |

Events fire through the existing `track()` analytics stub (env-gated) — names: `lead_quote_submit`, `whatsapp_click`, `call_click`, `newsletter_submit`, `report_download`.

## 5. URL discipline — before → after

**Keep every existing URL.** No moves required for the core IA. Existing legacy 301s in `next.config.ts` (`/blog→/insights`, `/our-services→/services`, `/about-us→/about`, www→non-www, `digitplus.tech`→canonical, etc.) are retained.

| Change | URL | Action |
|---|---|---|
| (none — core IA) | all current routes | keep, self-canonical |
| Optional future combos | `/services/{service}/{city}` ×3 | **deferred**; when built → sitemap add + LocalBusiness JSON-LD, no redirect (new URLs) |

**JSON-LD updates (coherent, non-breaking):** add `Service` schema `areaServed` = the 3 cities on service pages; keep `LocalBusiness` on location pages; article `BlogPosting` unchanged; add `BreadcrumbList` already present. Sitemap regenerates from the route set (unchanged), so it stays in sync.

## 6. What needs YOUR approval before Agent 2 (Copy Chief) starts
1. **Location strategy** — approve "**strengthen 3 location pages + interlink, DEFER the 18 combos**" (my recommendation), or do you want the 3 justified combos built now (accepting they'll be thin until real local proof arrives)?
2. **Hub-spoke** — approve the article→pillar map (adds an up-link block per article + "further reading" per pillar; no article body edits)?
3. **Lead-gen** — approve trimming `ContactForm` to ≤5 fields and the per-page conversion events?
4. **Primary home query** — "enterprise IT solutions company in Nigeria" as the H1 target — confirm, or you have a preferred exact phrase?
