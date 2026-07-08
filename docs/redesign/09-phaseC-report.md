# 09 — Phase C + Polish Report (dark redesign)

_Branch `redesign/dark-raycast`. Everything below is committed and `tsc --noEmit`-clean at each commit. Live Lighthouse/axe/visual checks run on the Vercel preview after imagery is downloaded (sandbox has no network)._

## What shipped

### Design system (Phase A/B)
Dark Raycast/Resend canvas (`#060707`), hairline + glow surfaces, **green `#3ddc84`** structural accent / **orange `#ff8a3d`** single CTA, all pairs WCAG-AA verified (`05-dark-audit.md`). Primitives: `Glow`, `Eyebrow` (mono, optional `· 01`), `.cover-dark`, Connective Line (orange→green), circuit-trace hero motif (replaced the dot field). Green focus rings, `themeColor #060707`.

### SEO & IA (Agent 1, approved — `07-seo-architecture.md`)
Keyword→page map (one primary query per page); **3 location pages strengthened + interlinked, 18 combos deferred** (anti-doorway); hub-and-spoke: per-article pillar map (`src/lib/content/pillars.ts`) → article up-links + service "Further reading"; lead-gen (quote CTA, phone, WhatsApp, ≤5-field form); URLs unchanged, JSON-LD/sitemap intact.

### Copy (Agent 2, approved — `08-copy-deck.md`)
~Half the word count. Keyword H1 "Enterprise IT solutions, built to just work". Service ×6 + industry ×8 + location ×3 intros cut from two paragraphs to one sentence.

| Sample | Before (words) | After (words) |
|---|--:|--:|
| Home hero subhead | ~55 | 18 |
| it-procurement intro | ~92 | 22 |
| managed-services intro | ~78 | 20 |
| government industry intro | ~72 | 13 |
| Testimonial (home) | display-scale | 19px reading scale |

### Typography (Polish 1) — client picked **Option A**
Sora (display + buttons) / Figtree (body) / JetBrains Mono (eyebrows), via `next/font`. Losing fonts + `/font-preview` route deleted. Button spec: Sora 600, −0.01em, `rounded-lg`, orange, inner-glow hover, 15px CTA.

### Six polish fixes
1. **Fonts** → Option A rolled through the token layer.
2. **Nav Contact split** — bare number removed; ghost icon-button → Call/WhatsApp/Email dropdown (keyboard + outside-click dismissible); same 3 actions in mobile menu. Number stays in footer + LocalBusiness JSON-LD.
3. **Stats** — "8+ years" (wrong; founded 2022) → **"2022 / Operating since"**; band now 2022 · 50+ clients · 6 services · 3 cities (all verifiable). Years also corrected in About, author bio, home beats.
4. **Testimonials** — quote → body font 19px / 1.6 / white-80; name 14px, role 13px white-50.
5. **Motion** — hero lead-tile scroll parallax (CSS scroll-timeline, overscan, reduced-motion safe); entrances 0.32→0.65s; bento hover-neighbor dim (Raycast trick, 150ms); route fade-through-black.
6. **Imagery** — home 5-image bento hero; `FeatureImage` (cover-dark + mono label + graceful placeholder) wired into services/[slug], industries/[slug], About, 3 locations; `reports/image-shortlist.md` + download script.

## Verification

### Static (run in-repo, PASS)
- Nav renders no bare phone number (uses `ContactMenu`). ✅
- Stats band contains "2022"; no "8+ years" anywhere in app code. ✅
- Testimonial quote at 19px (not `text-h3`). ✅
- 6 unique service metaTitles; JSON-LD/schema files untouched; sitemap route set unchanged. ✅
- `tsc --noEmit` clean at every commit. ✅
- Copy within budgets (hero H1 6 words; subhead 18; intros 1 sentence). ✅

### Pending on Vercel preview (needs imagery downloaded)
- [ ] Lighthouse mobile — Perf ≥ 90, SEO = 100, CLS < 0.1 (home/article/service)
- [ ] axe — a11y ≥ 95; green focus rings; reduced-motion emulation
- [ ] All hero + page images render (no 404s); LCP ≤ 2.5s; collage collapses at 390px
- [ ] Every wired image has alt (✅ in code) + a CREDITS entry (pending download)

## Outstanding (client/asset side)
- Download imagery: `public/images/hero/*` (5, script in earlier notes) + page images (`reports/image-shortlist.md`). Verify/swap any `FAILED` IDs via the search terms; add CREDITS.json per folder.
- Real testimonials, partner-logo reseller auth, real report data (pre-existing blockers).
- **PR:** no GitHub remote is configured, so the PR can't be opened yet. Add a remote (or connect the repo to GitHub) and the branch is ready to PR — do NOT merge; leave for review.

## Commit range
`redesign/dark-raycast`, 21 commits from the cream→dark pivot through Polish 6. No changes to forms/integration logic, routes, or SEO plumbing beyond coherent, documented updates.
