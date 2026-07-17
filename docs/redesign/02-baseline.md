# 02 — Performance & A11y Baseline (Reconnaissance)

_Branch: `redesign/apple-minimal`, no source changes yet (branch == `main` + docs)._

## Build & typecheck (run by Orchestrator)
| Check | Command | Result |
|---|---|---|
| Typecheck | `tsc --noEmit` | ✅ **Clean (exit 0)** |
| Production build | `next build` (Turbopack) | ⚠️ **Fails locally — environmental only** |

### Why the build fails locally (not a code defect)
`src/app/layout.tsx` loads Inter / Montserrat / JetBrains Mono via **`next/font/google`, which fetches `.woff2` from `fonts.gstatic.com` at build time.** This sandbox has **no outbound network**, so every font request times out:

```
Turbopack build encountered 12 warnings:
There was an issue requesting https://fonts.gstatic.com/s/inter/…woff2
Connection timed out when requesting https://fonts.gstatic.com/s/montserrat/…woff2
```

The build succeeds in any networked environment (Vercel, and per `docs/LAUNCH-CHECKLIST.md` it already produced the Lighthouse numbers below).

### ⚠️ Workflow constraint this imposes
**`next build`, Lighthouse, and axe cannot run in this sandbox.** For Phases 2–3, the usable local gates are:
- **`tsc --noEmit`** (no network) — primary correctness gate.
- **Static/code review** against the spec + AA contrast math done on token values.
- Optional mitigation (out of scope unless approved): switch to **`next/font/local`** self-hosted `.woff2` — makes builds network-independent *and* removes build-time font fetch (a real perf/robustness win). Deferred to a decision.
- Full `next build` + Lighthouse + axe must run on **Vercel staging** (matches the master prompt's own note to "re-run on the deployed staging URL").

## Known baseline numbers (from `docs/LAUNCH-CHECKLIST.md`, production build)
| Page | Perf | A11y | Best-Practices | SEO |
|---|:-:|:-:|:-:|:-:|
| Home (with canvas motif) | **90** | 97 | 96 | **100** |
| Article (insights) | **90** | 92 | — | **100** |

## Known a11y issues to fix in this restyle
1. **Article a11y 92** — muted-text **contrast** below AA (`--text-muted` sage on dark green).
2. **Unnamed links** on the article template (icon/share links missing accessible names).
3. Re-run **axe** on staging after the flip; target **a11y ≥ 95**.

## Gates the restyle must not regress (Phase 3)
- **Performance ≥ 90** (mobile).
- **SEO = 100.**
- **A11y ≥ 95** (up from 92 — the cream flip must fix muted contrast).
- **CLS < 0.1** (guard: animate only `transform`/`opacity`; reserve image dimensions).
- No JSON-LD / metadata / sitemap / robots / canonical changes.

## Bundle sizes
Not capturable locally (build aborts at the font-fetch step before emitting the route table). Capture on the first successful **staging** build and record here.
