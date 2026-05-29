---
name: restrained-futurism
description: Use whenever building, restyling, or reviewing any UI for the Digitplus corporate site. Encodes the brand's modern, minimalist, futuristic-in-craft design language so the frontend feels designed, not assembled. Use proactively for any component, page, layout, color, type, or motion work.
---

# Restrained Futurism — Digitplus Design Language

Designing for **digitplustechnology.com**, an enterprise B2B IT company whose site must win
trust from government, banking, and enterprise procurement buyers. The aesthetic is
**modern, minimalist, and futuristic — but restrained.** Futuristic in *craft and
precision*, never in costume. The polish of **Linear, Vercel, Stripe, Raycast** — not a neon
crypto landing page. Calm, inevitable, premium.

## RECONCILED BRAND CONSTRAINTS (these override any generic "futurism" defaults)
The official Pishon brand kit is applied and is binding:
- **Palette:** Forest Green `#20493B` (brand) + Ember Red `#C75334` (the single accent) +
  Cream `#F7F1E0` + warm khaki neutrals. **Do NOT introduce a cyan/electric-blue accent** —
  the futuristic feel comes from craft, not a foreign color.
- **Theme:** **Light is the default.** A polished dark mode exists as an opt-in toggle, and
  its canvas is built from **deep forest green** (not generic near-black) so it stays
  Digitplus. Tokens are class-based (`.dark` on `<html>`); never force dark by default.
- **Fonts:** Montserrat (display / H1 / H2), Inter (body / UI), and a **monospace** for
  eyebrows, labels, stats, and metadata (technical-precision signal).
- **Approach:** re-skin in place on the existing token-driven component system. Do NOT
  migrate to shadcn/ui or rip out working components.

## Hard rule: reskin, do not break the engine
Visual revamp only. DO NOT alter routes, page metadata, JSON-LD, sitemap/robots, MDX
content, the content-access layer (`src/lib/content`), forms, or API handlers in ways that
change behavior or SEO. Preserve semantics and accessibility (WCAG 2.1 AA).

## Aesthetic principles
- **One accent, disciplined.** Ember Red used sparingly for CTAs, links, eyebrows, focus.
  Forest green for brand surfaces/depth. Greyscale warm neutrals carry the rest. Optional
  *subtle* luminous treatment of the brand hues — never a rainbow.
- **Glass & hairlines for depth.** Frosted/translucent sticky nav and raised surfaces
  (backdrop-blur); 1px hairline borders; soft, low-opacity layered shadows. Depth from light
  and spacing — never heavy drop shadows or ornament.
- **Typographic command.** Oversized display headings, tight optically-corrected negative
  tracking, tight leading, fluid `clamp()`. Mono for eyebrows/labels/stats. ~1.6 body
  leading, ~65ch measure. Type does most of the design work.
- **Space as luxury.** Generous negative space on an 8pt grid; big confident hero moments,
  quiet dense data sections; aligned edges; consistent vertical rhythm.
- **Texture, barely.** A fine grain/noise overlay at very low opacity, and at most ONE
  subtle aurora/gradient-mesh moment (hero only), built from brand greens + ember. One focal
  moment, not effects everywhere. Reduced-motion aware.
- **Motion with intent.** Tokenized durations (fast 150 / base 220 / slow 320 ms), easing
  `cubic-bezier(0.22,1,0.36,1)`. Scroll-reveal (fade + small translate), refined hover/press,
  gentle gradient drift. ALWAYS gate behind `prefers-reduced-motion`.
- **Craft in the 5%.** Pixel-aligned spacing, consistent icon strokes, immaculate focus
  rings, balanced optical sizing.

## Forbidden (the "AI slop" look)
No centered-everything layouts, no purple/cyan gradient blobs, no emoji bullets, no
identical generic card grids, no foreign accent colors, no clutter. Deliberate, opinionated
choices only.

## Implementation
- Tailwind v4 `@theme` tokens in `src/app/globals.css` are the single source of truth:
  semantic color (background, surface, surface-raised, hairline, text, muted, accent, brand),
  8pt spacing, radius, elevation, blur, motion. Light + `.dark` both defined there.
- Components stay presentational, prop-driven, accessible, responsive — just as considered at
  390px as on a wide display.
- Performance: next/image, lazy/optional decorative effects, Core Web Vitals "Good" on mobile.
