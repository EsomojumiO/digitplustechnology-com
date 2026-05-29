# SEO Checklist & Coverage — digitplustechnology.com

Owned by the SEO engineer. This documents what was implemented, where each
schema lives, and the remaining manual (off-codebase) steps.

## SEO library — `src/lib/seo/`

| File | Exports |
| --- | --- |
| `jsonld.tsx` | `JsonLd` — server component that renders `<script type="application/ld+json">`. JSON is serialized with `<` escaped to `<` to prevent any script-context break-out. |
| `schema.ts` | `organizationSchema()`, `websiteSchema()`, `serviceSchema(service)`, `articleSchema(article, url)`, `reportSchema(report, url)`, `breadcrumbSchema(items)`, `faqSchema(faqs)`, `localBusinessSchema(location)`, plus `absoluteUrl(path)`. All derive from `siteConfig`. |
| `metadata.ts` | `buildMetadata({title, description, path, image?, type?, noindex?})` → Next `Metadata` with absolute canonical, OpenGraph, Twitter, robots. |
| `index.ts` | Barrel re-export of the above. |

Stable `@id` anchors: `#organization` and `#website` (resolved against
`siteConfig.url`) so Service/Article/Report/LocalBusiness nodes reference the
Organization rather than re-embedding it.

## JSON-LD coverage by page

| Page | Schema injected |
| --- | --- |
| `src/app/layout.tsx` (sitewide) | `Organization` + `WebSite` (with `SearchAction`) — present on every page |
| `services/[slug]` | `Service` + `BreadcrumbList` + `FAQPage` (from `data.faqs`) |
| `industries/[slug]` | `BreadcrumbList` + `FAQPage` (when the industry has `faqs`) |
| `about` | `BreadcrumbList` (Organization inherited sitewide) |
| `insights/[slug]` | `BlogPosting` + `BreadcrumbList` |
| `reports/[slug]` | `Article` (report) + `BreadcrumbList` |
| `locations/abuja|lagos|port-harcourt` | `LocalBusiness` (per-city, with geo + opening hours) + `BreadcrumbList` |
| `locations` (overview) | Organization only (sitewide) |

## Canonicals

Root layout sets `metadataBase` + default canonical `/`. Per-page
`alternates.canonical` (root-relative; Next makes it absolute):

- Already present before this work: `/insights`, `/reports`, `/insights/category/[category]`, `/insights/[slug]`, `/reports/[slug]`.
- Added (minimal/additive): `/services`, `/industries`, `/approach`, `/about`, `/contact`, `/privacy`, `/terms`, `/locations`, `/services/[slug]`, `/industries/[slug]`, `/locations/{city}`.
- Home `/` inherits the layout default canonical.

Existing `generateMetadata` / `metadata` exports were NOT rewritten — only an
`alternates.canonical` field was appended (and Article/Report pages already had
full OG/Twitter, left intact).

## sitemap.xml — `src/app/sitemap.ts`

Absolute URLs from `siteConfig.url`. Includes:

- Static: `/`, `/services`, `/industries`, `/approach`, `/about`, `/insights`, `/reports`, `/locations`, `/contact`, `/privacy`, `/terms`.
- 6 service detail pages, 8 industry detail pages, 3 location pages.
- Insights category archives — only categories with published articles (`getAllCategories()`).
- Every published article (`getAllArticles()`, `lastModified` = `updatedAt || publishedAt`).
- Every report (`getAllReports()`, `lastModified` = `publishedAt`).

`changeFrequency` + `priority` hints set per route class (home 1.0, hubs 0.8–0.9, details 0.7–0.8, legal 0.3).

## robots.txt — `src/app/robots.ts`

Allow `/`, disallow `/api/`, `sitemap` → `${siteConfig.url}/sitemap.xml`,
`host` → `siteConfig.url`.

## Redirects & headers — `next.config.ts`

**Redirects (301 / permanent):** home aliases (`/home`, `/index`, `/index.html`)
and legacy path equivalents of old anchors → real routes (`/our-services` →
`/services`, `/sectors` → `/industries`, `/about-us` → `/about`, `/how-we-work`
→ `/approach`, `/contact-us` → `/contact`, `/blog` + `/blog/:slug` → `/insights`,
etc.). Hash fragments (`/#services`) are never sent to the server, so they
cannot be redirected here — handled by the new nav client-side.

**Security headers (all routes):** `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`,
`Permissions-Policy` (camera/mic/geolocation/browsing-topics disabled),
`Strict-Transport-Security` (2yr, includeSubDomains, preload). No CSP shipped —
deliberately omitted to avoid breaking Next's inline runtime/hydration and the
JSON-LD scripts; add later with a nonce-based policy if required.

**Images:** `formats: ["image/avif", "image/webp"]`.

## Open Graph

- Default site OG image: `src/app/opengraph-image.tsx` (1200×630, brand wordmark
  + tagline + accent, via `next/og` ImageResponse, edge runtime). Used for any
  page without its own image.
- Per-article / per-report OG overrides come from `seo.ogImage` (falls back to
  the cover) in their existing `generateMetadata`.

## Remaining manual steps (off-codebase)

1. **Logo asset:** schema references `${siteConfig.url}/logo-full.png`. The brand
   PNGs are not yet in `public/` (placeholder per CLAUDE.md / BLOCKERS). Drop
   `logo-full.png` into `public/` so the Organization/LocalBusiness `logo` URL
   resolves. Until then the JSON-LD is valid but the logo URL 404s.
2. **Google Search Console:** verify the property (DNS TXT or
   `metadata.verification.google` in the layout) and submit `/sitemap.xml`.
3. **www vs non-www:** canonical host is `https://digitplustechnology.com`
   (non-www). Enforce www → non-www (and any apex variants) at DNS / Vercel
   domain settings. See the domain-consolidation TODO comment in `next.config.ts`.
4. **Stray domain `digitplus.tech`:** decide consolidate-vs-park with the client,
   then 301 to the canonical host (BLOCKERS).
5. **Analytics env:** wire the privacy-respecting analytics provider via the
   env-gated stub (`src/lib/analytics.ts`).
6. **Google Business Profile:** align NAP exactly with `siteConfig` for the
   LocalBusiness pages.
