# Decisions Log

Running log of non-obvious choices made during the autonomous build. Format: date — decision — rationale.

- 2026-05-29 — **Stack as scaffolded:** Next.js 16.2.6 + React 19 + Tailwind v4 (CSS-first `@theme`, no `tailwind.config.js`). — create-next-app latest defaults; aligns with brief's Next/TS mandate.
- 2026-05-29 — **Content layer = file-based MDX** under `/content`, accessed only via `src/lib/content/*`. — Brief requires unattended build with no API keys; keeps a clean seam for a future Sanity/Payload swap.
- 2026-05-29 — **Brand palette = neutral ramp + single indigo/blue accent placeholder.** — Real brand kit not supplied (see BLOCKERS). Tokenized so a one-file swap applies the real palette.
- 2026-05-29 — **Forms post to stub route handlers** that validate + log + return success when integration env vars are absent. — Brief mandates swappable integration layer; no keys available in build env.
- 2026-05-29 — **Analytics + cookie consent = env-gated stubs**, default-decline. — Privacy-first requirement; no provider chosen yet.
- 2026-05-29 — **Services & Industries detail pages = single dynamic `[slug]` route** (not 14 per-slug folders), with `generateStaticParams` + `dynamicParams=false` pulling slugs from `src/lib/site.ts`. — Pages are data-driven; one route is cleaner and keeps slugs single-sourced. Statically prerendered, so SEO/SSG is unaffected.
- 2026-05-29 — **Insights uses a single `[slug]` dynamic segment** (scaffold placeholder) instead of separate `/insights/[category]` and `/insights/[slug]`. — Next.js forbids two different dynamic slug names at the same route level; a single segment dispatching article-vs-category is the standard resolution. insights-engine owns `src/app/insights/**` and will implement the real dispatch + generateStaticParams.
