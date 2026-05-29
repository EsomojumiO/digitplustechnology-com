# Project: digitplustechnology.com — Corporate Profile & Content Engine

Read `docs/brief.md` in full before doing anything. It is the source of truth.
This file is the condensed operating constitution shared by all agents.

## ENVIRONMENT — read first (critical)
- Node is installed via nvm and is **NOT on the default PATH**. Any shell command that
  uses node/npm/npx MUST first run:
  `export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"`
- **Subagents: do NOT run `npm run build`, `npm install`, or `npx` yourself.** Just write
  files. The orchestrator runs builds/typechecks centrally between waves and routes
  failures back to you. This avoids PATH issues and keeps verification consistent.
- Stack already scaffolded: **Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4**
  (using `@tailwindcss/postcss`, `src/` dir, import alias `@/*`). Tailwind v4 is
  CSS-config-first (`@import "tailwindcss"` + `@theme` in `globals.css`) — there is no
  `tailwind.config.js` by default; add tokens via `@theme` in CSS.

## What we are building
The corporate website + authority/content engine for **Digitplus Technology Limited**,
a Nigerian B2B IT solutions company (Abuja HQ; Lagos & Port Harcourt delivery).
Jobs: present an enterprise-grade brand, generate B2B leads, run a content engine
(industry articles + downloadable quarterly reports) built for SEO.

This site is NOT an online store. No catalogue, cart, checkout, or payments — that
is a separate property (thedigitplus.com). Transactional/commercial content does NOT
belong here.

## Locked technical decisions (do not re-litigate; just build)
- **Framework:** Next.js 16 App Router, TypeScript. SSG + ISR for content pages.
- **Styling:** Tailwind v4 via `@theme` tokens in `src/app/globals.css`. One central token set.
- **Content layer:** file-based **MDX** in `/content` (articles + reports), parsed at build
  time. No external API keys needed. Access MUST go through `src/lib/content/*` so a
  headless CMS (Sanity/Payload) can replace MDX later WITHOUT touching pages. Document the
  migration path in `docs/CMS-MIGRATION.md`.
- **Rendering:** Every page server-rendered/static and fully crawlable. NO client-only
  rendering of primary content. Interactive bits (forms, filters) are client islands.
- **Hosting target:** Vercel (configure; do not deploy).

## Non-negotiable quality bars
- Multi-page architecture. Every service, industry, article, report = its own indexable
  URL (see sitemap in brief). No single-page anchor sites.
- SEO: per-page editable metadata; Open Graph + Twitter tags; JSON-LD (Organization,
  Service, Article/BlogPosting, BreadcrumbList, FAQPage, LocalBusiness); auto sitemap.xml +
  robots.txt; canonical tags; breadcrumbs; semantic HTML.
- Accessibility: WCAG 2.1 AA (heading order, alt text, focus states, contrast, keyboard nav).
- Performance: mobile-first; next/image; target Lighthouse SEO ≥ 95, Perf ≥ 90 mobile.
- Privacy-friendly: honeypot + server validation for forms (no invasive captcha);
  analytics hook (env-gated stub); cookie consent defaulting to decline.

## Content lanes (prevents cannibalizing the store domain)
Articles here are TOP-OF-FUNNEL authority/strategy content for B2B decision-makers
("How to structure an IT refresh"). Product-led buying guides belong on the store, never
here. Encode this as editor guidance in `docs/EDITORIAL.md`.

## Design philosophy (applies to EVERY agent that touches UI)
Hold the bar of Apple's design language. The site should feel inevitable, calm, premium —
designed, not assembled.
- **Clarity first.** Content leads; chrome recedes. Ruthless reduction. Generous negative
  space is a feature.
- **Deference.** UI serves content. Restrained palette (mostly neutrals + ONE confident
  accent). No decorative noise, gratuitous gradients, or heavy shadows. Depth from spacing,
  hierarchy, subtle elevation.
- **Typographic precision.** Clear modular scale, strong size/weight contrast. Tight optical
  letter-spacing on large headings; ~65ch measure and ~1.6 line-height for body. Use clamp().
- **Rigorous grid & rhythm.** 8pt spacing system; consistent vertical rhythm; aligned edges.
  Confident hero moments; quiet dense info sections.
- **Materials & depth, sparingly.** Soft layered surfaces; 1px hairline dividers; consistent
  large radii; occasional frosted/translucent sticky nav. Subtle, never flashy.
- **Motion with intent.** Small fast eased transitions (150–320ms, custom cubic-bezier);
  tasteful scroll-reveal/hover. Respect `prefers-reduced-motion`.
- **Craft in the details.** Pixel-aligned icons, consistent stroke widths, immaculate focus
  states. The difference is in the 5%.
- **Detail at every scale.** Just as considered at 390px as on a wide display. Mobile-first,
  fluid type/space (clamp), no awkward breakpoints.
Reference frame: Apple HIG + the polish of Linear, Vercel, Stripe. AVOID the generic
"AI landing page" look (centered everything, purple gradient blobs, emoji bullets,
identical card grids). Make deliberate, opinionated choices.

## Working agreement (AUTONOMY)
- Keep executing. Pick sensible defaults; record them in `docs/DECISIONS.md`; continue.
- Missing real-world input (brand kit, real testimonials, API keys, photos) → use clearly
  labelled placeholders/mock data, log to `docs/BLOCKERS.md`, continue. Never halt over an
  asset.
- Definition of done: `npm run build` succeeds; `npx tsc --noEmit` clean; all sitemap routes
  exist and render; sitemap.xml/robots.txt generated; JSON-LD present; seed content visible;
  forms submit to stubbed handlers; `docs/QA-REPORT.md` written.

## File ownership (avoid collisions when agents run in parallel)
- scaffolder         -> root config, src/app/layout, global shell (header/footer/whatsapp)
- design-system      -> src/components/ui/**, src/styles/**, globals.css @theme tokens
- pages-builder      -> src/app/(marketing)/**, src/data/** (services, industries copy)
- cms-content        -> content/**, src/lib/content/**, docs/EDITORIAL.md, docs/CMS-MIGRATION.md
- insights-engine    -> src/app/insights/**
- reports-engine     -> src/app/reports/**
- forms-integrations -> src/app/api/**, src/components/forms/**, src/lib/integrations/**
- seo-engineer       -> src/lib/seo/**, src/app/sitemap.ts, src/app/robots.ts, next.config, metadata
- qa-reviewer        -> docs/QA-REPORT.md only (read elsewhere)

## Brand / contact facts (use consistently — NAP)
- Name: Digitplus Technology Limited
- Email: hello@digitplustechnology.com
- Phone: +234 803 786 8120  •  WhatsApp: https://wa.me/2348037868120
- HQ: Abuja, Nigeria. Delivery: Lagos, Port Harcourt.
- Logos in use: logo-full.png (dark), logo-full-white.png (light) — placeholders ok if absent.
- Stats: 50+ enterprise clients, 8+ years, 6 service lines, Abuja HQ.
- Store cross-link: thedigitplus.com (referral only).
