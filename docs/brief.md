# Digitplus Technology — Developer Brief (working copy)

> Source of truth for the build. Condensed from the client brief v1.0. Where this and
> CLAUDE.md disagree, raise it in docs/DECISIONS.md.

## 1. Overview
Digitplus Technology Limited — Nigerian B2B IT solutions company (Abuja HQ; Lagos &
Port Harcourt delivery). End-to-end IT: procurement, hardware supply, infrastructure
deployment, managed services. CAC-registered, 8+ years, 50+ enterprise clients. Buyers:
enterprises, government, banks, hospitals, schools.

Two web properties by design:
- **digitplustechnology.com** (THIS build) — corporate profile + authority/content engine.
- **thedigitplus.com** (separate) — ecommerce storefront. Out of scope; referral link only.

This site IS: credibility anchor, B2B lead-gen engine, content/authority engine (articles +
quarterly reports), SEO asset. It is NOT a store (no catalogue/cart/checkout/payments).

Primary objective: replace the old single-page site with a multi-page, server-rendered,
SEO-first website. Every service, industry, article, report = its own indexable URL.

## 2. Success metrics
Qualified leads (contact forms, consultation requests, report downloads w/ company email);
organic authority (indexed pages, rankings, organic growth); credibility (time on page,
pages/session, downloads); content cadence (articles/month, quarterly reports); technical
(Core Web Vitals Good on mobile, Lighthouse SEO ≥ 95). Non-technical staff must publish
articles & reports without a developer (hard requirement → CMS-shaped content layer).

## 3. Audiences
1. Government / public-sector IT decision-makers — procurement, compliance, audit-readiness.
2. Enterprise & banking IT managers — multi-site infra, SLAs, vendor accountability.
3. Healthcare & education IT leads — reliability/uptime, budget-conscious.
4. SME owners / ops leads — guidance, not jargon.
5. Researchers / press / partners — discover via reports/articles (backlinks, authority).
Tone: professional, disciplined, trustworthy, plain-spoken. No hype.

## 4. Brand & design
Use existing assets (logo-full.png dark, logo-full-white.png light). Full brand kit TBD →
use neutral palette + one confident accent as placeholder (log in BLOCKERS). Aesthetic:
enterprise-grade, clean, confident, spacious — "trusted infrastructure partner," not trendy
startup. Strong type hierarchy, generous whitespace, restrained accent, high contrast.
Imagery: authentic where possible; partner trust strip (Microsoft, HP, Dell, Cisco, Lenovo,
Fortinet). Mobile-first (variable Nigerian connections). WCAG 2.1 AA. See CLAUDE.md "Design
philosophy" for the binding execution bar (Apple-grade).

## 5. Sitemap (every node is its own URL)
```
/                                  Home
/services                          Services overview
  /services/it-procurement
  /services/hardware-supply
  /services/infrastructure-solutions
  /services/managed-services
  /services/technology-advisory
  /services/deployment-implementation
/industries                        Industries overview
  /industries/government
  /industries/banking-financial-services
  /industries/enterprise
  /industries/sme
  /industries/healthcare
  /industries/education
  /industries/oil-gas-energy
  /industries/logistics-manufacturing
/approach                          How We Work (6-step process)
/about                             About / story / credentials
/insights                          Article hub (content engine)
  /insights/[category]             Category archive
  /insights/[slug]                 Article
/reports                           Quarterly reports hub
  /reports/[slug]                  Report landing + gated download
/locations  (+ /locations/abuja, /lagos, /port-harcourt)  optional, LocalBusiness schema
/contact
/privacy
/terms
sitemap.xml / robots.txt
```

## 6. Page specs (highlights)
- **Home:** Hero ("Plan. Procure. Deploy. Manage." + subhead + primary CTA "Request a Free
  IT Assessment" + secondary "See How We Work"; coverage line Abuja • Lagos • Port Harcourt);
  trust strip; services snapshot (6 cards); Why Digitplus (End-to-End Accountability,
  Nationwide Reach, Sector-Specific Experience, Procurement Integrity); philosophy quote;
  process preview (6 steps → /approach); industries grid; testimonials; by-the-numbers
  (50+ clients, 8+ years, 6 service lines, Abuja HQ); featured insights (3 latest); featured
  report; contact/CTA band.
- **Services overview + 6 detail pages:** each = H1, intro, what's included, how it works,
  relevant industries, a testimonial, FAQ block (FAQPage schema), CTA.
- **Industries overview + 8 detail pages:** each addresses sector concerns (Government →
  documented procurement, LPO, audit/compliance; Banking → branch infra, compliance;
  Healthcare → reliability/uptime; etc.). Ranks for sector queries.
- **Approach:** 6 steps — Discovery & Needs Assessment → Solution Design & Proposal →
  Procurement & Logistics → Deployment & Installation → Testing & Handover → Ongoing
  Support & Management. Visual, scannable.
- **About:** story, operational-discipline positioning, credentials (CAC, 8+ years,
  authorized reseller channels), optional leadership, by-the-numbers, trust statement.
  Organization JSON-LD.
- **Contact:** form (Full Name*, Email*, Phone, Company/Org*, Service Interest dropdown of 6
  services + "Other / Not sure", Message); direct details (hello@digitplustechnology.com,
  +234 803 786 8120, Abuja HQ, coverage note); WhatsApp CTA (wa.me/2348037868120) — also a
  persistent floating widget site-wide; honeypot spam protection; privacy line.
- **Locations (optional):** lightweight Abuja/Lagos/Port Harcourt pages, LocalBusiness schema,
  consistent NAP.
- **Legal:** real Privacy Policy + Terms (replace old `#` placeholders).

## 7. Content engine (Insights)
Article model: title, slug, excerpt, body (MDX), featured image (+alt), category, tags,
author, published date, updated date, reading time (auto), SEO fields (meta title/desc, OG
override), canonical, status (draft/published).
Categories: IT Strategy & Advisory, Infrastructure, Procurement, Cybersecurity, Managed
Services, Industry & Policy, Guides.
Hub `/insights`: featured/latest, category filter, paginated grid, search; card = image,
category, title, excerpt, date, reading time.
Article `/insights/[slug]`: clean reading layout, breadcrumb, byline+date, reading time,
proper heading hierarchy, inline images, pull quotes, social share, related articles (same
category), CTA block, Article/BlogPosting JSON-LD, OG/Twitter.
Editorial lane: authority/top-of-funnel only. Product buying guides → store, not here.
Document in docs/EDITORIAL.md.

## 8. Quarterly reports & lead-gen
Report model: title, slug, quarter/year, cover image, summary/teaser, key findings (ungated
preview), full PDF (upload), publish date, SEO fields, archived flag.
Hub `/reports`: featured latest + archive grid (cover, title, quarter, teaser).
Landing `/reports/[slug]`: public ungated teaser + key findings (indexable), then GATED
download form (Full Name, Work Email*, Company*, Role optional) → record lead, push to email
list, deliver PDF. Optional "request next report" newsletter opt-in. Design supports
data-rich, citable reports with shareable preview.

## 9. Forms & integrations
Contact form → email notify hello@ + store submission + (recommended) CRM push.
Report gate → lead store + email-marketing list + PDF delivery.
Newsletter signup (footer + report pages).
CRM: integrate client CRM if available; else HubSpot free tier; swappable layer.
Email/marketing: Brevo/Mailchimp/similar (confirm). WhatsApp floating widget
(wa.me/2348037868120). All integrations behind a service layer / env-configured webhooks,
swappable without rebuild. Ship working STUB adapters that log + succeed when env absent.

## 10. SEO (core mandate)
SSR/SSG for all primary content; unique editable meta title+desc per page/article/report;
OG + Twitter per page (per-article OG image); JSON-LD: Organization (sitewide), Service,
Article/BlogPosting, LocalBusiness, BreadcrumbList, FAQPage; clean semantic lowercase
hyphenated URLs; auto sitemap.xml + robots.txt; canonical tags; breadcrumbs sitewide;
internal linking (services ↔ industries ↔ articles ↔ reports topic clusters); image
optimization (next-gen formats, responsive, lazy, mandatory alt); Core Web Vitals Good
mobile, Lighthouse SEO ≥ 95 / Perf ≥ 90 mobile; 301 redirects from old anchors → new pages
(in next.config); www vs non-www canonical; identical NAP everywhere; deliberate cross-link
to thedigitplus.com store.

## 11. Stack (locked — see CLAUDE.md)
Next.js 16 App Router + TS; SSG+ISR; MDX content layer behind src/lib/content; Tailwind v4
tokens; Vercel target; route handlers for forms; env-based config; README with setup.

## 12. CMS roles (future, document path)
Admin/Editor/Author. Editors: create/edit/publish articles & reports, upload images
(enforced alt) + PDFs, per-item SEO, schedule/draft, manage categories/tags — no code.
Preview before publish; media library w/ optimization. For now MDX simulates this; document
swap in docs/CMS-MIGRATION.md.

## 13. Perf / a11y / security
Mobile budget, image optimization, caching, CDN. WCAG 2.1 AA. HTTPS + secure headers; form
spam protection via honeypot + server validation (no invasive captcha); rate-limit form
endpoints. Cookie consent defaults to declining non-essential; no third-party trackers
before consent.

## 14. Analytics
Privacy-respecting (Plausible/Fathom/GA4-conservative) — env-gated stub now. Track: contact
submits, consultation requests, report downloads, newsletter signups, WhatsApp clicks, store
referral clicks. GSC + sitemap submission; Google Business Profile NAP alignment.

## 15. Out of scope (store handles)
Catalogue, cart, checkout, payments, refurbished inventory, product buying guides, any
ecommerce. Only connection = referral cross-links.

## 17. Phasing (we build all in one pass)
P1 corporate core (all marketing pages + SEO foundation + forms + WhatsApp + redirects).
P2 content engine (Insights). P3 reports & lead-gen. Phase 1 must be SEO-complete.

## Appendix — existing copy to reuse/expand
- Hero/value prop: "Plan. Procure. Deploy. Manage." + end-to-end positioning.
- Six services w/ sub-items:
  - IT Procurement: Hardware, Software, LPO Support, Multi-site.
  - Hardware Supply: Servers, Workstations, Networking, Warranties.
  - Infrastructure Solutions: Structured Cabling, LAN/WAN, Server Rooms, UPS/Power.
  - Managed Services: Remote, On-site, SLA, Monitoring.
  - Technology Advisory: IT Strategy, Budgeting, Vendor Selection, Roadmaps.
  - Deployment & Implementation: Installation, Configuration, Testing, Training.
- Why Digitplus pillars: End-to-End Accountability, Nationwide Reach, Sector-Specific
  Experience, Procurement Integrity.
- 6-step process (see Approach above).
- Eight industries (see sitemap).
- Three testimonials (illustrative — replace w/ attributable; log in BLOCKERS).
- About: operational-discipline narrative, CAC registration, 8+ years, authorized channels.
- By the numbers: 50+ clients, 8+ years, 6 service lines, Abuja HQ.
- Contact + service-coverage statement.

## 19. Inputs needed from client (track in BLOCKERS)
Brand kit; authorized-reseller confirmation per logo; real testimonials/case studies;
canonical contact identity + stray-domain decisions (digitplus.tech, alt numbers/emails);
CRM + email platform choice; quarterly-report data source; final Privacy/Terms; real photos.
