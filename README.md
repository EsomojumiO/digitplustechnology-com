# Digitplus Technology — Corporate Website & Content Engine

The corporate profile + authority/content engine for **Digitplus Technology Limited**, a
Nigerian B2B IT solutions company (Abuja HQ; Lagos & Port Harcourt delivery). This is the
**digitplustechnology.com** property — a multi-page, server-rendered, SEO-first site with a
content engine (industry articles + gated quarterly reports) and B2B lead capture.

> This is **not** the ecommerce store. The storefront lives separately at
> `thedigitplus.com`; this site only deliberately cross-links to it.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` tokens in `src/app/globals.css` — no `tailwind.config.js`)
- **MDX** content layer (`content/`), accessed only through `src/lib/content/*` (a clean seam
  for a future Sanity/Payload headless CMS — see `docs/CMS-MIGRATION.md`)
- SSG + ISR rendering · JSON-LD structured data · auto sitemap/robots
- Forms via Next route handlers + provider-agnostic, env-configured integration layer
- Target host: **Vercel**

## Prerequisites

- **Node.js ≥ 20** (developed on Node 24 via nvm), npm.

> Note for this workspace: Node is installed via nvm and is not on the default PATH. Load it
> before running anything:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"
> ```

## Getting started

```bash
npm install
cp .env.example .env.local   # all vars optional; integrations stub gracefully without them
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build (SSG/ISR) |
| `npm run start` | Serve the production build (`PORT=3210 npm run start` to pick a port) |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Typecheck |

## Project structure

```
content/                    MDX articles (content/insights) + reports (content/reports)
public/                     static assets (logos, /reports PDFs, /images) — see BLOCKERS
src/
  app/
    layout.tsx              root layout: shell + sitewide JSON-LD + base metadata
    page.tsx                Home
    (marketing)/            services, industries (dynamic [slug]), approach, about,
                            contact, privacy, terms, locations
    insights/               hub, /category/[category], /[slug] article
    reports/                hub, /[slug] gated landing
    api/                    contact, newsletter, report-lead route handlers
    sitemap.ts  robots.ts  opengraph-image.tsx
  components/
    ui/                     design system (tokens-driven, presentational)
    layout/                 header, footer, WhatsApp widget, cookie consent
    forms/                  ContactForm, ReportGateForm, NewsletterForm + primitives
    motion/                 Reveal (scroll-reveal, reduced-motion safe)
  data/                     services/industries/testimonials/process/stats copy
  lib/
    site.ts                 canonical site config + NAP + nav (single source of truth)
    content/                MDX access layer (the CMS seam)
    integrations/           email / marketing / CRM adapters (stubbed) + rate-limit + store
    seo/                    JSON-LD builders, metadata helper
    analytics.ts            privacy-respecting track() (no-op until enabled)
docs/                       brief, decisions, blockers, editorial, CMS migration, SEO, QA
```

## Content management (no code required)

Editors add articles/reports by creating MDX files in `content/insights` or
`content/reports` with the documented frontmatter. See **`docs/EDITORIAL.md`** for the
non-technical guide (content-lane rules, frontmatter templates, categories, alt-text + SEO
fields). The same content interface is designed to be swapped for a headless CMS without
touching pages — see **`docs/CMS-MIGRATION.md`**.

## Environment / integrations

All lead-capture integrations are **stubbed**: with no env vars they validate, log to the
server console, and return success. Set the variables in `.env.example` to enable real
providers (email/Resend or SMTP, marketing list, CRM, analytics) — no code changes needed.
Outstanding platform choices are tracked in `docs/BLOCKERS.md`.

## Deployment (Vercel)

1. Push the repo and import it into Vercel (framework auto-detected as Next.js).
2. Set `NEXT_PUBLIC_SITE_URL=https://digitplustechnology.com` and any integration env vars.
3. Resolve `www` vs non-`www` to one canonical host and 301 stray domains
   (`digitplus.tech`) to the canonical domain (DNS + `next.config.ts` redirects).
4. After deploy: verify in Google Search Console and submit `/sitemap.xml`; align Google
   Business Profile NAP with `src/lib/site.ts`.
5. Replace placeholders per `docs/BLOCKERS.md` (brand kit, logos, testimonials, report data,
   legal copy, photography).

## Documentation

- `docs/brief.md` — the build spec (source of truth)
- `docs/DECISIONS.md` — architectural decisions log
- `docs/BLOCKERS.md` — client inputs still required before launch
- `docs/EDITORIAL.md` · `docs/CMS-MIGRATION.md` · `docs/SEO-CHECKLIST.md` · `docs/QA-REPORT.md`
