# QA Report — digitplustechnology.com

Date: 2026-05-29 · Branch: `build` · Verified against the Definition of Done in `CLAUDE.md`.

## Verdict: PASS (launch-ready pending client inputs in BLOCKERS.md)

All automated gates are green and a live production-server smoke test passed. Remaining
items are real-world inputs (brand kit, real testimonials, integration keys, photography,
final legal copy) — all clearly placeholdered and tracked in `docs/BLOCKERS.md`. None block
the build or a staging deploy.

---

## 1. Automated gates

| Gate | Command | Result |
|------|---------|--------|
| Typecheck | `npx tsc --noEmit` | ✅ clean (0 errors) |
| Lint | `npm run lint` (eslint flat config) | ✅ clean (0 errors, 0 warnings) |
| Production build | `npm run build` | ✅ success — **43 routes**, 43/43 static pages generated |

## 2. Route smoke test (live `npm run start`, prod build)

All routes returned **HTTP 200** (sampled across every page type):

`/`, `/services`, `/services/[slug]` (×6), `/industries`, `/industries/[slug]` (×8),
`/approach`, `/about`, `/contact`, `/privacy`, `/terms`, `/locations` (+ abuja/lagos/
port-harcourt), `/insights`, `/insights/[slug]`, `/insights/category/[category]`,
`/reports`, `/reports/[slug]`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`.

`GET /api/contact` → **405** (POST-only, correct).

## 3. SEO

| Check | Result |
|-------|--------|
| SSR / static rendering of primary content | ✅ all content pages prerendered (SSG) or server-rendered; `/insights` server-rendered (uses `?page`) |
| Unique, editable `<title>` + meta description per page | ✅ verified (e.g. About: "About Digitplus Technology — A Disciplined Nigerian IT Partner · Digitplus Technology") |
| Canonical tags | ✅ absolute canonicals present (e.g. `https://digitplustechnology.com/about`) |
| JSON-LD — Organization + WebSite (sitewide) | ✅ present on every page |
| JSON-LD — Service + FAQPage + BreadcrumbList (service pages) | ✅ verified on `/services/it-procurement` |
| JSON-LD — BlogPosting + BreadcrumbList (articles) | ✅ verified on article page |
| JSON-LD — LocalBusiness + Geo + OpeningHours (locations) | ✅ verified on `/locations/abuja` |
| JSON-LD — FAQPage (Q/A) | ✅ Question/Answer nodes present |
| Open Graph + Twitter tags + default OG image | ✅ present; `/opengraph-image` renders 200 |
| sitemap.xml | ✅ 35 `<loc>` entries (static + all article/report/category slugs) |
| robots.txt | ✅ allow all, disallow `/api/`, host + sitemap set |
| Clean semantic lowercase-hyphenated URLs | ✅ matches the brief's sitemap |
| 301 redirects + security headers | ✅ configured in `next.config.ts` (see §6) |

## 4. Accessibility (spot checks)

| Check | Result |
|-------|--------|
| Exactly one `<h1>` per page | ✅ (home = 1) |
| Semantic landmarks (`header`/`main#main`/`footer`/`nav`) + skip link | ✅ |
| Focus-visible rings on interactive elements | ✅ (accent ring token, design system) |
| Keyboard-accessible nav dropdowns, mobile menu, FAQ disclosure | ✅ (aria-expanded/controls, Escape, roving focus) |
| `prefers-reduced-motion` respected | ✅ Reveal + global motion clamp |
| Alt text on images (enforced via content frontmatter + props) | ✅ (coverAlt required in content model) |
| Forms: labels, aria-invalid, aria-describedby errors, live status | ✅ |

> Full automated audits (axe / Lighthouse a11y, contrast on final brand colors) should be
> re-run once the **real brand palette** lands, since contrast depends on final colors.

## 5. Forms & integrations (live POST tests)

| Endpoint | Test | Result |
|----------|------|--------|
| `/api/contact` | valid payload | ✅ 200 `{ok:true}`; lead recorded; email+CRM stubs logged (skipped, no env) |
| `/api/contact` | missing fields | ✅ 400 with per-field `errors` |
| `/api/contact` | honeypot filled | ✅ silent 200, **no lead recorded / no processing** |
| `/api/newsletter` | valid | ✅ 200; marketing stub logged |
| `/api/report-lead` | valid | ✅ 200; returns `data.pdfUrl`; marketing+CRM stubs logged |

Honeypot + zod server validation + in-memory rate limiting all active. Integrations are
provider-agnostic stubs that log and succeed when env is absent (swap via env — see
`.env.example`).

## 6. Security / privacy headers (verified live)

`X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` ·
`X-Frame-Options: SAMEORIGIN` · `Permissions-Policy: camera=(), microphone=(),
geolocation=(), browsing-topics=()` · `Strict-Transport-Security: max-age=63072000;
includeSubDomains; preload`. Cookie consent defaults to **decline**; no third-party
scripts loaded pre-consent.

## 7. Content engine

- 3 seed articles (top-of-funnel authority lane, distinct categories) + 1 seed quarterly
  report with ungated key-findings preview and gated PDF download — all rendering.
- MDX content layer behind `src/lib/content/*` (stable CMS seam; swap path documented in
  `docs/CMS-MIGRATION.md`). Editor guidance in `docs/EDITORIAL.md`.

## 8. Known limitations / follow-ups (non-blocking)

- All items in `docs/BLOCKERS.md` (brand kit, partner-logo authorization, real
  testimonials, integration platform keys, report data, final legal copy, photography).
- Lead persistence is in-memory (needs a DB) and rate-limiting is per-instance (needs a
  shared store) for production scale — see BLOCKERS rows 16–17.
- Re-run Lighthouse Performance/SEO and axe on the deployed staging URL with real images +
  brand colors to confirm the ≥90 Perf / ≥95 SEO targets on mobile.

## How to reproduce
```
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"   # nvm node 24
npm install
npm run lint && npx tsc --noEmit && npm run build
PORT=3210 npm run start    # then curl the routes above
```
