# 00 — Architecture Map (Reconnaissance)

_Branch: `redesign/apple-minimal`. Read-only audit. Produced by the Orchestrator inline (the 3 parallel recon agents hit a background-stream watchdog; recon was redone directly)._

## Stack
- **Next.js 16.2.6** (App Router, **Turbopack** build), **React 19.2.4**, **TypeScript** (`tsc --noEmit` clean).
- **Tailwind CSS v4** — CSS-config-first. No `tailwind.config.js`. All tokens live in `@theme inline` inside `src/app/globals.css`.
- **framer-motion ^12.40.0 already installed.** No new motion dependency required by this restyle.
- Content: file-based MDX via `next-mdx-remote` + `gray-matter` (`src/lib/content/*`).

## The single source of truth for the visual system
**`src/app/globals.css`** — one file, 5 layered sections:
1. **Primitive ramps** (`--neutral-*`, `--accent-*` Ember Red, `--brand-*` Forest Green, `--cream`).
2. **Semantic tokens** (`--background`, `--surface`, `--surface-raised`, `--text`, `--text-muted`, `--border-hairline`, `--accent`, `--brand`, shadows, `color-scheme`). **This is the layer the cream flip re-points.**
3. `@theme inline` — wires semantic tokens into Tailwind utilities (`bg-background`, `text-muted`, `bg-brand`, `border-hairline`, etc.).
4. Base layer (body bg/color, focus ring, reduced-motion reset, selection).
5. Component-layer type scale (`.text-display/.text-h1…`) + utilities (`.aurora`, `.grain-overlay`, `.route-enter`, `.reveal-init`, `.measure`, `.hairline`).

**Consequence:** because every component consumes *semantic* tokens, re-palette is mostly a token-layer edit — not a component rewrite.

## Fonts (`src/app/layout.tsx`)
`next/font/google`: **Inter** (`--font-geist-sans`, body/UI), **Montserrat** (`--font-montserrat`, display/H1/H2), **JetBrains Mono** (`--font-geist-mono`, eyebrows/labels/stats). ⚠️ Fetched at build time → local build needs network (see `02-baseline.md`).

## Motion system (already built) — `src/components/motion/`
- `tokens.ts` — `DUR {fast .15, base .22, slow .32}`, `EASE_OUT [0.22,1,0.36,1]` (**exact match to the spec's requested signature ease**), `EASE_IN_OUT`, `SPRING`, `STAGGER 0.07`.
- Primitives: `MotionPrimitives.tsx` (`FadeIn`, `Stagger`, `StaggerItem`), `Reveal.tsx`, `Magnetic.tsx`, `Marquee.tsx`, `CountUp.tsx`, `HeroMotif.tsx`, `NetworkField.tsx` (signature network motif), `index.ts`.
- Route transitions: `src/app/template.tsx` (+ `.route-enter` keyframes).
- Belt-and-suspenders scroll reveal: `/public/reveal.js` (vanilla, React-independent, content visible without JS).
- Reduced-motion honored in CSS base layer AND per-primitive.

**Gap vs. spec:** no `AnimatedRule` primitive yet (spec's uniqueness motif). Everything else the master prompt asks to "install/create" already exists.

## Component inventory (paths)
- **Layout:** `layout/Header.tsx` (client; frosted sticky, accessible dropdowns, mobile slide-over), `Footer.tsx`, `Logo.tsx`, `WhatsAppWidget.tsx`, `CookieConsent.tsx`, `SkipLink.tsx`.
- **UI primitives (`components/ui/`):** `Section` (tones: default/muted/raised/**inverse**; spacing sm/md/lg), `Container`, `Hero` (aurora + motif flags), `Button` (primary/secondary/ghost × sm/md/lg), `Card`, `Grid`, `SectionHeading`, `Eyebrow`, `Badge`, `Breadcrumbs`, `CTABand`, `FAQ`, `Prose`, `Stat`/`StatGrid`, `Testimonial`, `ServiceCard`/`IndustryCard`/`ProcessStep`.
- **Home (`components/home/`):** `TrustMarquee`, `WhyPillar`, `IndustriesFilter`, `ContentShelf`.
- **Insights (`app/insights/_components/`):** `ArticleCard`, `AuthorBio`, `InsightsSearch`, `ShareBar`.
- **Forms (`components/forms/`):** `ContactForm`, `NewsletterForm`, `ReportGateForm`, field controls, `Honeypot`, `validation` (zod). → **Do not touch logic.**
- **SEO (`lib/seo/`):** `metadata.ts`, `jsonld.tsx`, `schema.ts`. → **Do not touch.**

## Routes (~70 URLs incl. dynamic)
`(marketing)/`: about, approach (+`_components/ProcessTimeline`), contact, ecosystem, industries (+`[slug]`), locations (index + abuja/lagos/port-harcourt), services (+`[slug]`), privacy, terms. Root `/`. `insights/` (list, `category/[category]`, `[slug]`). `reports/` (list, `[slug]`). API: contact, newsletter, report-lead.

## Section tone system (key to the flip)
`Section` `tones` map (`components/ui/Section.tsx`): `default→bg-background`, `muted→bg-surface`, `raised→bg-surface-raised +border-y`, `inverse→bg-brand text-brand-foreground`. On the cream flip, **`inverse` becomes the deep-Forest-Green punctuation band on a cream page** — the brand color stays prominent as an accent surface.

## The one thing the restyle team must know
Re-palette from the semantic-token layer of `globals.css` — **do not** hardcode colors in components. Only **14 dark-assumption class usages exist across 6 files** (`page.tsx`, `about`, `approach`, `Footer`, `Header`, `WhatsAppWidget`), and most sit inside dark bands (inverse/footer) that stay dark, so they remain valid. Verify each rather than mass-replacing.
