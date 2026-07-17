# 05 — Dark "Raycast/Resend" Token Audit (Phase A)

_Branch: `redesign/dark-raycast` (off `redesign/apple-minimal`). Direction: near-black canvas, hairline + glow surfaces, **green structural / orange CTA** accents. Content/routes/SEO/forms untouched._

## Palette — verified WCAG AA (all against canvas `#060707`, L≈0.003)
| Token | Value | Role | Contrast |
|---|---|---|---|
| `--background` | **`#060707`** | green-tinted near-black canvas (never `#000`) | — |
| `--surface` | `#0b0d0c` | barely-lifted band (separated by hairline, not lightness) | — |
| `--surface-raised` | `rgba(255,255,255,0.03)` | card fill (2–4% white max) | — |
| `--border-hairline` | `rgba(255,255,255,0.08)` | hairline everywhere | — |
| `--border-hairline-hover` | `rgba(255,255,255,0.14)` | hairline brighten on hover | — |
| `--text` (display) | `#fafafa` | white-ish display, never `#fff` | ~19:1 ✅ |
| `--text-body` | `rgba(255,255,255,0.72)` | body | ~10.5:1 ✅ |
| `--text-muted` | `rgba(255,255,255,0.6)` | sub-headlines/secondary | ~7.3:1 ✅ |
| `--text-faint` | `rgba(255,255,255,0.5)` | **floor** — large/decorative only | ~5.4:1 ✅ (0.45 = 4.45 ✗, banned for text) |
| `--accent-green` | **`#3ddc84`** | links, eyebrows, stat numbers, icon strokes, active nav, Connective Line | ~11:1 ✅ |
| `--accent` (orange CTA) | **`#ff8a3d`** | single primary CTA fill per screen | with **dark** label `#060707` = **~8.6:1 ✅** (white label = 2.3 ✗ → use dark text) |
| focus ring | `#3ddc84` 2px, offset 2px | visible on dark ✅ | — |

**Signature gradient** `orange→green` used in exactly TWO places: (1) home hero headline `background-clip:text` (white → gradient tail, Raycast-style); (2) Connective Line draw-in. Nowhere else.

**Bans:** accent colors as body text; >1 orange element per viewport; saturated fills over large areas; pure `#000`/`#fff`.

## Per-file fix list

### Token layer — `src/app/globals.css` §2 (Phase B, primary)
Full dark flip of every semantic token above; retune shadows to near-black glows; `color-scheme: dark` (already set — the cream flip had switched it to light, flip back). Restore grain to ~0.02 and scope hero-only. Re-tune `.aurora` → repurpose as the accent radial **glow** (green/orange, 8–15% opacity, pre-blurred).

### Hardcoded light-assumption borders → hairline tokens
| File | Line(s) | Now | → |
|---|---|---|---|
| `components/ui/Card.tsx` | 36 | `hover:border-neutral-300` | `hover:border-[var(--border-hairline-hover)]` |
| `components/ui/ServiceCard.tsx` | 50 | `hover:border-neutral-300` | hairline-hover |
| `components/ui/IndustryCard.tsx` | — | `border-neutral-300` | hairline / hairline-hover |
| `components/home/IndustriesFilter.tsx` | — | `border-neutral-300` | hairline |
| `app/insights/page.tsx` | — | `border-neutral-300` | hairline |
| `app/(marketing)/locations/page.tsx` | — | `border-neutral-300` | hairline |
| `app/(marketing)/ecosystem/page.tsx` | — | `border-neutral-300` | hairline |

### Already dark-appropriate — KEEP (verify only)
- `Footer.tsx` `border-white/10`, `border-white/15`, `bg-white/10` — white-on-dark at low alpha (standardize to hairline token for consistency, not correctness).
- `Header.tsx:213` `bg-neutral-950/40` mobile backdrop scrim — fine.
- `WhatsAppWidget.tsx` `bg-[#25D366] text-white` — WhatsApp brand, keep.
- `page.tsx` / `approach` / `about`: `text-neutral-50` + `text-neutral-400` — light text sitting on the `inverse`/quote bands; valid on dark. Re-map to `--text`/`--text-muted` tokens for consistency; contrast already AA.

### Logo — `components/layout/Logo.tsx`
**No change.** Already hardcoded to the white mark (`digitplus-icon-white.png`) + cream wordmark ("dark-only theme"). Correct for the dark canvas. Assets present: `digitplus-icon-white.png`, `digitplus-wordmark-white.png`. (Note: this was actually a latent bug on the cream branch — moot now.)

### Images / covers need a dark treatment — 8 files
`next/image` covers (Unsplash article covers ~1600×900 with varied/light backgrounds, report covers, home shelf) will glare on near-black. **Spec a reusable `.cover-dark` wrapper:**
- Container `relative overflow-hidden rounded-lg border border-hairline`.
- Overlay `::after`: `linear-gradient(to top, rgba(6,7,7,0.65), transparent 55%)` for text legibility, plus a whole-image `background: rgba(6,7,7,0.12)` multiply-ish darken.
- Slight `brightness(0.92) contrast(1.02)` on the `<img>` to seat it in the dark.
- Files: `insights/_components/ArticleCard.tsx`, `insights/page.tsx`, `insights/[slug]/page.tsx`, `reports/_components/ReportCard.tsx`, `reports/[slug]/page.tsx`, `home/ContentShelf.tsx`, `app/page.tsx` (featured report image).

### Meta / head — `src/app/layout.tsx`
Add `export const viewport = { themeColor: "#060707" }`; ensure `<html>` stays dark. (color-scheme comes from the token layer.)

### Accent-driven gradients (auto-retune via tokens, verify)
- `approach/_components/ProcessTimeline.tsx:47` `from-accent via-accent to-accent/30` — becomes orange; consider green for the process spine. Decide in Phase C.
- `HeroMotif.tsx` / `Marquee.tsx` mask gradients — mechanical masks, no color, keep.

## New primitives to build (Phase B)
- **`<Glow>`** — absolutely-positioned pre-blurred radial (green/orange, 8–15% opacity, `pointer-events-none`, `aria-hidden`). NOT animated `filter`.
- **`<Eyebrow>`** — extend existing: uppercase mono, letter-spaced, **green**, optional `· 01` index (Resend pattern).
- **Card recipe** — hairline + `bg-surface-raised`, hover: border→hairline-hover + `-translate-y-0.5` + faint green glow (pseudo-element `box-shadow`/`opacity`, 200ms).
- **NetworkField** — promote to hero background, faint green lines, low opacity (the uniqueness signature alongside the Connective Line).

## Phase B gate
`tsc --noEmit` clean + zero remaining `border-neutral-300` / light-assumption colors from this list. Then push Vercel preview for the early dark-flip sanity check.
