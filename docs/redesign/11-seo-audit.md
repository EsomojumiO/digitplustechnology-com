# 11 — SEO Audit (shipped HTML)

**Date:** 2026-07-12
**Scope:** Technical + on-page SEO of the *built, production* HTML served by the running
production server at `http://localhost:3210`. This audits rendered markup only (titles,
meta, canonical, OG/Twitter, JSON-LD, headings, `<img alt>`, internal links, sitemap,
robots, HTTP status) — not copy quality or Core Web Vitals field data.
**Method:** Each route fetched with `curl`; the returned HTML parsed with `grep`/`python3`
(entity-decoded for length checks; every `application/ld+json` block validated with
`json.loads`). Routes: all 15 top-level pages, one page from each dynamic family
(`/services/it-procurement`, `/industries/government`,
`/insights/it-readiness-checklist-for-government-agencies`,
`/insights/category/procurement`, `/reports/state-of-enterprise-it-in-nigeria-2026`),
plus `/sitemap.xml`, `/robots.txt`, and a 404 probe.

**Headline result:** The site is technically sound — every route 200s, one H1 each, valid
JSON-LD everywhere with matching NAP, self-referencing canonicals, a clean 71-URL sitemap,
sane robots.txt, excellent internal linking with no generic anchors, and a proper 404. The
real defects are two heading-order skips, one page missing its social image, and a
systemic over-length problem in titles and meta descriptions.

---

## Check area 1 — Headings (one H1, logical outline)

Every audited page has **exactly one `<h1>`** ✅. Outline is logical everywhere **except**
two pages where the H1 is followed directly by H3s (H2 skipped):

| Page | 1×H1 | Order | Observed H1 / issue |
|---|---|---|---|
| `/` | ✅ | ✅ | h1 → h2 → h3 … clean |
| `/about` | ✅ | ✅ | clean |
| `/approach` | ✅ | ❌ | `h1, h3, h3, h3, h3, h3, h3, h2 …` — 6 process steps render as H3 with no H2 above |
| `/contact` | ✅ | ✅ | clean |
| `/ecosystem` | ✅ | ✅ | clean |
| `/services` | ✅ | ❌ | `h1, h3×6, h2 …` — 6 service cards render as H3 with no H2 above |
| `/industries` | ✅ | ✅ | clean |
| `/locations` (+ abuja/lagos/ph) | ✅ | ✅ | clean |
| `/insights` | ✅ | ✅ | clean |
| `/reports` | ✅ | ✅ | clean |
| `/privacy`, `/terms` | ✅ | ✅ | clean |
| `/services/it-procurement` | ✅ | ✅ | clean |
| `/industries/government` | ✅ | ✅ | clean |
| `/insights/…government-agencies` | ✅ | ✅ | clean |
| `/insights/category/procurement` | ✅ | ✅ | clean |
| `/reports/…nigeria-2026` | ✅ | ✅ | clean |

→ Fixes **S1** (approach), **S2** (services).

## Check area 2 — Titles & meta descriptions

All titles unique ✅. All descriptions unique ✅ (no duplicates anywhere). Lengths measured
after HTML-entity decoding. Target: title ≤60, description 140–160.

| Page | Title len | Title | Desc len | Desc |
|---|---|---|---|---|
| `/` | 54 ✅ | IT Solutions Company in Nigeria \| Digitplus Technology | 193 ❌ | over — truncates |
| `/about` | 79 ❌ | About Us, A Disciplined, Accountable Nigerian IT Partner · … | 184 ❌ | over |
| `/approach` | 76 ❌ | Our Approach, A Clear, Documented IT Delivery Process · … | 176 ❌ | over |
| `/contact` | 63 ❌ | Contact Us, Request a Free IT Assessment · … | 169 ❌ | over |
| `/ecosystem` | 46 ✅ | The Digitplus Ecosystem · … | 151 ✅ | ok |
| `/services` | 71 ❌ | IT Services in Nigeria, Procurement & Managed IT · … | 174 ❌ | over |
| `/industries` | 82 ❌ | Industries We Serve, Government, Banking, Healthcare & More · … | 170 ❌ | over |
| `/locations` | 66 ❌ | Our Locations, Abuja, Lagos & Port Harcourt · … | 152 ✅ | ok |
| `/locations/abuja` | 69 ❌ | IT Solutions in Abuja, Digitplus Technology HQ · … | 176 ❌ | over |
| `/locations/lagos` | 66 ❌ | IT Solutions in Lagos, Digitplus Technology · … | 164 ❌ | over |
| `/locations/port-harcourt` | 74 ❌ | IT Solutions in Port Harcourt, Digitplus Technology · … | 161 ❌ | over |
| `/insights` | 64 ❌ | IT Insights for Nigerian Business Leaders · … | 158 ✅ | ok |
| `/reports` | 56 ✅ | Enterprise IT Reports for Nigeria · … | 204 ❌ | worst — 44 over |
| `/privacy` | 37 ✅ | Privacy Policy · … | 174 ❌ | over |
| `/terms` | 35 ✅ | Terms of Use · … | 147 ✅ | ok |
| `/services/it-procurement` | 57 ✅ | IT Procurement Services in Nigeria · … | 169 ❌ | over |
| `/industries/government` | 66 ❌ | IT Solutions for Government & Public Sector · … | 151 ✅ | ok |
| `/insights/…government-agencies` | 80 ❌ | IT Readiness Checklist for Government Agencies in Nigeria · … | 170 ❌ | over |
| `/insights/category/procurement` | 43 ✅ | Procurement Insights · … | 98 ❌ | short — under 140 |
| `/reports/…nigeria-2026` | 73 ❌ | The State of Enterprise IT in Nigeria, 2026 Report · … | 157 ✅ | ok |

**Titles > 60 chars:** 13 pages. Root cause is the ` · Digitplus Technology` template
suffix (23 chars, from `src/app/layout.tsx` `title.template`) added on top of already-long
per-page titles. → Fix **S6**.
**Descriptions out of the 140–160 band:** 13 over (reports 204 is the worst), 1 short
(procurement category, 98). → Fixes **S4**, **S5**.

## Check area 3 — JSON-LD

Every `application/ld+json` block on every page **parses as valid JSON** ✅. Type coverage:

| Type | Where seen | Status |
|---|---|---|
| Organization | every page (global) | ✅ |
| WebSite + SearchAction | every page (global) | ✅ |
| BreadcrumbList | about, locations/*, services/*, industries/*, insights article, report | ✅ |
| Service | `/services/it-procurement` | ✅ |
| FAQPage | `/services/it-procurement`, `/industries/government` | ✅ |
| BlogPosting | `/insights/…` article | ✅ |
| Article | `/reports/…` report | ✅ |
| LocalBusiness | `/locations/abuja` `/lagos` `/port-harcourt` | ✅ |

**NAP cross-check (schema vs footer):** exact match ✅ —
name `Digitplus Technology Limited`, telephone `+234 803 786 8120`,
email `hello@digitplustechnology.com`, Abuja/FCT/NG. LocalBusiness uses branch names
(e.g. `Digitplus Technology Limited, Abuja`) which is correct for per-location entities.
Minor gap (not a failure): the `/insights/category/*` archive and the `/insights` &
`/reports` hubs carry no BreadcrumbList/CollectionPage — optional enhancement, not required.

## Check area 4 — Sitemap, robots, canonicals

| Item | Result |
|---|---|
| `/sitemap.xml` | 200, **71 URLs**, absolute `https://digitplustechnology.com/…`; spot-checked 7 (banking, managed-services, roadmap article, cybersecurity category, Q2 price-index report, refresh-or-repair, NDPR) → all **200**, no drafts ✅ |
| `/robots.txt` | `User-Agent: *` / `Allow: /` / `Disallow: /api/`, `Host:` + `Sitemap:` pointing at the live sitemap — sane, site not blocked ✅ |
| Canonicals | present and **self-referencing** on every audited page ✅ |
| 404 handling | `/does-not-exist` → **404** ✅ |

## Check area 5 — Internal linking & anchor text

| Check | Result |
|---|---|
| Generic anchors ("click here"/"read more"/"learn more"/"here") | **none found** across all pages ✅ |
| Hub → ≥3 spokes | `/insights` → 10 articles, `/services` → all 6 services, `/industries` → 8 sectors, `/reports` → 2 reports (all live), `/insights/category/procurement` → 5 articles ✅ |
| Article → pillar/hub | `/insights/…government-agencies` links up to `/insights` (×6) and `/insights/category/guides` plus related spokes ✅ |
| Orphans (reachable ≤3 clicks) | none — every sitemap URL reachable via home → hub → spoke ✅ |

## Check area 6 — Images

| Check | Result |
|---|---|
| Missing `alt` attribute | **0** across all pages ✅ |
| Empty `alt=""` | Exactly 3 per page — all are the decorative brand icon (`/brand/digitplus-icon-white.png`) in header/footer/mobile-nav, each paired with a visible `<span>` wordmark inside the same link. Empty alt is the **correct** a11y choice here (avoids duplicate SR announcement) ✅ |
| Hero / LCP sizing | Home hero `<img>` carry full `srcSet` + `sizes="(min-width: 1024px) 46vw, 100vw"`; first slide is eager (not lazy) ✅. Minor: no `fetchpriority="high"` emitted on the LCP hero — acceptable, low priority. |

## Check area 7 — Sanity (lang, viewport, social)

| Check | Result |
|---|---|
| `<html lang="en">` | present ✅ |
| viewport meta | present ✅ |
| og:title / og:description | present on all 20 pages ✅ |
| twitter:card | `summary_large_image` on all 20 pages ✅ |
| og:image / twitter:image | present on 19 pages (auto-generated by `src/app/opengraph-image.tsx`, 1200×630, with alt/width/height) — **MISSING on `/reports`** ❌ |

The `/reports` hub declares an inline `openGraph` block **without** `images`, which
suppresses the `opengraph-image.tsx` file-convention image for that route (the `/insights`
hub, which omits `openGraph` entirely, keeps the auto image). → Fix **S3**.

---

## PASS / FAIL SUMMARY

Counting page-level checks across the 7 areas:

| Area | Pass | Fail |
|---|---|---|
| 1. Single H1 (20) | 20 | 0 |
| 1. Heading order (20) | 18 | 2 |
| 2. Title ≤60 (20) | 7 | 13 |
| 2. Desc 140–160 (20) | 6 | 14 |
| 3. JSON-LD valid + NAP (20) | 20 | 0 |
| 4. Sitemap / robots / canonical / 404 (4) | 4 | 0 |
| 5. Internal linking / anchors (5) | 5 | 0 |
| 6. Images alt + hero sizing (20) | 20 | 0 |
| 7. lang / viewport / og / twitter (20) | 19 | 1 |
| **Total** | **119** | **30** |

30 failures collapse into **6 in-repo fixes** (S1–S6); the bulk (27) are the
title/description length issues, which are two systemic edits.

---

## FIX LIST (in-repo)

**S1 — Heading skip on `/approach` (h1 → h3).**
File: `src/app/(marketing)/approach/_components/ProcessTimeline.tsx:93` (step title is `<h3>`)
and `src/app/(marketing)/approach/page.tsx` (timeline section has no H2).
Problem: the six process steps render as `<h3>` immediately under the page `<h1>`, skipping H2.
Fix: add a section `<h2>` heading above the timeline in `approach/page.tsx` (e.g. an H2
"The process, step by step" — it can be `sr-only` if the design has no room), OR change the
step title in `ProcessTimeline.tsx:93` from `<h3>` to `<h2>`. Prefer adding the section H2 so
the visual scale stays put.

**S2 — Heading skip on `/services` (h1 → h3).**
File: `src/components/ui/ServiceCard.tsx:61` (card title is `<h3>`) and
`src/app/(marketing)/services/page.tsx` (grid at `services.map`, line ~43, has no H2).
Problem: the six service cards render as `<h3>` directly under the page `<h1>`, skipping H2.
Fix: add a section `<h2>` (e.g. "Our service lines") immediately before the `services.map`
grid in `services/page.tsx`. Do **not** bump `ServiceCard` to `<h2>` — it is reused on the
home page under an existing H2; changing the shared component would break that outline.

**S3 — `/reports` hub missing og:image & twitter:image.**
File: `src/app/reports/page.tsx:17–27` (inline `openGraph` and `twitter` objects).
Problem: declaring `openGraph` without `images` overrides the `opengraph-image.tsx`
file-convention image, so the reports hub ships no social image.
Fix: add `images: [{ url: "/opengraph-image" }]` to the `openGraph` object and
`images: ["/opengraph-image"]` to the `twitter` object — OR delete both inline blocks and
let the root layout + file convention supply them (loses the custom OG title, so prefer
adding `images`).

**S4 — Meta descriptions over 160 chars (13 pages).**
Files: the `description` string in each page's metadata —
`src/app/page.tsx` (193), `src/app/reports/page.tsx` (`DESCRIPTION` const, 204 — worst),
`src/app/(marketing)/about/page.tsx` (184), `/approach` (176), `/contact` (169),
`/services` (174), `/industries` (170), `/locations/abuja` (176), `/locations/lagos` (164),
`/locations/port-harcourt` (161), `/privacy` (174), `src/app/(marketing)/services/[slug]/page.tsx`
(it-procurement, 169), `src/app/insights/[slug]/page.tsx` (article, 170, from MDX frontmatter/excerpt).
Problem: descriptions truncate in the SERP snippet.
Fix: trim each to 150–160 chars keeping the primary keyword up front + one reason to click.

**S5 — Category-archive descriptions under 140 chars.**
File: `src/lib/content/types.ts:52` (`CATEGORIES` array; procurement `description` at line 69
is 98 chars). Feeds `generateMetadata` in `src/app/insights/category/[category]/page.tsx:46`.
Problem: every category archive inherits a ~90–100 char description — too thin for SEO.
Fix: rewrite each `CATEGORIES[].description` to 140–160 chars with the category keyword +
a click reason (e.g. procurement → "Disciplined, documented IT sourcing for Nigerian
organisations — vendor accountability, LPO workflows, and audit-ready buying. Practical
guidance for procurement and finance leads.").

**S6 — Titles over 60 chars (13 pages).**
Files: per-page `title` in metadata (about, approach, contact, services, industries,
locations, locations/abuja, locations/lagos, locations/port-harcourt, insights,
industries/government, insights article, reports report) + the template suffix
`%s · Digitplus Technology` in `src/app/layout.tsx:51`.
Problem: with the 23-char ` · Digitplus Technology` suffix appended, these titles exceed the
~60-char SERP cutoff.
Fix: shorten each per-page title so `title + suffix ≤ 60` (drop the redundant second clause,
e.g. "About Us, A Disciplined, Accountable Nigerian IT Partner" → "About Digitplus" or
"A Disciplined Nigerian IT Partner"). Optionally shorten the template suffix to
` · Digitplus` to buy ~11 chars across the whole site in one edit.

---

## PENDING — HUMAN

- **Live canonical host:** all canonicals/OG URLs use `https://digitplustechnology.com`.
  Confirm this is the production apex (vs `www.`) and that DNS/redirects enforce one host,
  so canonicals aren't split. (Config-only in-repo via `siteConfig.url`; the decision is human.)
- **Search Console / Bing Webmaster:** submit `sitemap.xml`, verify domain property, watch
  Coverage + Core Web Vitals field data (this audit is markup-only, not field CWV).
- **External schema validation:** run the final URLs through Google Rich Results Test and
  schema.org validator once deployed (local validation here only confirmed JSON parses).
- **Google Business Profile:** create/claim GBP for the Abuja HQ (and Lagos/PH hubs if
  staffed) so the LocalBusiness schema is backed by a real listing; align NAP exactly.
- **Real OG imagery / brand assets:** the OG image is a generated template; a human may want
  a designed 1200×630 social card and real location photos (currently placeholders).

---

## Resolution log (2026-07-12)

All six in-repo fixes applied and re-verified against a fresh production build served on
`localhost:3210`. Re-run result: **20/20 pages pass** title ≤60, description 140–160, single
H1, and logical heading order; `/reports` now emits `og:image` + `twitter:image`.

| Fix | Status | What changed |
|---|---|---|
| **S1** `/approach` h1→h3 | ✅ | Added an `sr-only` `<h2>` ("The six-step delivery process") above the timeline — outline restored, design unchanged. |
| **S2** `/services` h1→h3 | ✅ | Added an `sr-only` `<h2>` ("Our service lines") above the service grid; shared `ServiceCard` left as `<h3>` so the home outline stays intact. |
| **S3** `/reports` no social image | ✅ | Added `images` to the inline `openGraph` + `twitter` blocks (`/opengraph-image`), restoring the file-convention OG image. |
| **S4** descriptions > 160 | ✅ | Trimmed all static-page descriptions (home, about, approach, services, industries, privacy, contact, reports) to 148–160. Per-item descriptions (service/industry `metaDescription`, article `metaDescription`/excerpt, report summary) are now word-boundary **clamped to ≤160 at the metadata layer** via `clampDescription()` — meta-only, so visible card excerpts keep their full text. Fixes all 32 long article metas + 2 reports + 6 data entries systemically. |
| **S5** category descriptions < 140 | ✅ | Rewrote all 7 `CATEGORIES[].description` to 149–161 (→ clamped to ≤160) with keyword + click reason. |
| **S6** titles > 60 | ✅ | Shortened the title template suffix `· Digitplus Technology` → `· Digitplus` (−11 chars sitewide); trimmed long per-page titles (about, approach, industries, 3 locations); made article + report `<title>` **absolute** (no brand suffix) since descriptive editorial titles run long. |

Also trimmed `siteConfig.description` (261 → 151) — the brand default used for the root
meta/OG and Organization/WebSite JSON-LD.

**Pending — Claude Code: none.** Everything the audit flagged as in-repo is fixed. The
`PENDING — HUMAN` items above (canonical host, Search Console, GBP, external validators,
designed OG art) carry to the launch ledger.
