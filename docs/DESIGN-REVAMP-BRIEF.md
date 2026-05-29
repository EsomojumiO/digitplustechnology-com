# Design Revamp Brief — digitplustechnology.com (reconciled)

Elevate the site to a modern, minimalist, futuristic-in-craft design ("restrained
futurism" — see `.claude/skills/restrained-futurism/SKILL.md`). VISUAL revamp only —
preserve all routes, metadata, JSON-LD, sitemap, content, and forms.

## Reconciled direction (decided with the client, supersedes the generic brief)
- **Theme:** light is the **default**; add a polished **opt-in dark mode** whose canvas is
  deep **forest green** (on-brand, not generic near-black). Class-based `.dark` toggle, no
  FOUC, persisted, accessible.
- **Accent:** keep the brand **Ember Red** + **Forest Green**. NO cyan/electric blue.
- **Approach:** **re-skin in place** on the existing token-driven components. NO shadcn
  migration.

## What "restrained futurism" adds here
1. Monospace eyebrows / labels / stats / metadata (technical-precision signal).
2. Commanding display typography (Montserrat), tighter optical tracking, fluid scale.
3. Glass/hairline depth (already on nav) + refined low-opacity shadows.
4. A fine grain overlay at very low opacity, and ONE subtle aurora moment in the hero
   (brand greens + ember), reduced-motion aware.
5. A tasteful, on-brand dark mode + toggle.
6. Tightened motion (scroll-reveal, hover/press, gentle drift).

## Preserve (non-negotiable)
Routes, page metadata, JSON-LD, sitemap.xml/robots.txt, MDX content, `src/lib/content`,
forms + API handlers, accessibility. Light default; dark is opt-in only.

## QA
`npm run build` + `npx tsc --noEmit` + `npm run lint` clean; every route renders in BOTH
themes with identical metadata/JSON-LD; a11y (contrast in light AND dark, focus states,
heading order, reduced-motion); 390px mobile; CWV hygiene. See docs/DESIGN-QA.md.
