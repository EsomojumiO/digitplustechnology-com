# 13 — Launch Ledger (final audit & cohesion pass)

**Branch:** `redesign/dark-raycast` · **PR:** #1 (open — do not merge; client merges after review)
**Date:** 2026-07-12 · **Gate:** `tsc --noEmit` clean + production `next build` green before
every commit; final verification re-run on the production build served locally (see §Final
verification). This is the single source of truth the client asked for.

The pass ran as four sequential phases — **audit-then-fix**, report-first — each producing a
report before any change: `10-consistency-audit.md` (design), `11-seo-audit.md` (SEO),
`12-copy-audit.md` (copy/voice), and this ledger.

---

## 1. DONE — shipped this pass

Total: **70 defects/fixes** closed (27 design + 6 SEO + 11 copy + 26 systemic sub-items),
across **8 fix commits + 3 resolution-log docs**. `8131c7f` is the pre-pass baseline.

### Design consistency — Phase 1 (`10-consistency-audit.md`)
| Commit | Scope |
|---|---|
| `689642c` | **Buttons (D1–D9):** canonical 3-variant system — `secondary` → transparent + hairline-0.14 border + white text; `ghost` → green text + animated underline (inline link). All quote/contact CTAs unified to **"Get a quote"**; WhatsApp → **"Chat on WhatsApp"**. Fixed ecosystem CTABand button passed as `children` (never rendered) → `actions`. Raw card-as-link → compose `Card`. |
| `ac8cb04` | **Colors (D10–D17) + focus states (D25):** orange-as-ink → green (`--accent-green`) across links, numbers, eyebrows, arrows, icon chips, hover ink; card hover borders → hairline-hover; `Badge` accent → green; `FormStatus` success orange → green; required asterisk → muted. Fixed invalid `outline-accent-green-300` focus-ring token ×4 (Footer a11y); store link → green; OG image → shipped dark tokens. Net: ≤1 orange element (the primary CTA) per viewport. |
| `4a4c73f` | **Typography (D18):** rogue px sizes → modular scale (`text-body-lg`/`text-small`/`text-caption`). |
| `eafd0cc` | **Templates (D21):** location role badge derived from `loc.role` in all 3 city files (can't drift). |
| `e929c3a` | **Spacing + states (D23, D24, D26, D27):** one hover-lift recipe across all cards; text-card radius aligned; `WhyPillar` composes `Card`; `.cover-dark` scrim applied to the 4 bare covers. |
| `ce043a7` | Resolution log: D19/D20/D22 accepted with rationale (documented, not defects). |

### SEO — Phase 2 (`11-seo-audit.md`) — verified **20/20 pages pass**
| Commit | Scope |
|---|---|
| `ebdc6c0` | **S1/S2** sr-only section H2s fix h1→h3 skips (`/approach`, `/services`). **S3** `/reports` og:image + twitter:image restored. **S4** all descriptions 140–160; `clampDescription()` added at the metadata layer (meta-only, visible excerpts untouched) → fixes 32 long article metas + 2 reports + data systemically. **S5** 7 category descriptions rewritten. **S6** title suffix `· Digitplus Technology` → `· Digitplus`; long titles trimmed; article/report `<title>` made absolute. `siteConfig.description` 261 → 151. |

### Copy & voice — Phase 3 (`12-copy-audit.md`)
| Commit | Scope |
|---|---|
| `f529203` | **C1** contact meta drops retired "free IT assessment". **C2** "Speak to our team" (sentence case). **C3** `lowerTitle()` preserves "IT" initialism. **C4** banned filler "robust hardware" ×3 removed. **C5** "license" → "licence". **C6/C7** whyUs + process titles → sentence case. **C8** newsletter label unified to "Subscribe". **C9** contact success comma splice fixed. **C10** home "Trusted" beat/body mismatch fixed. **C11** branded sentence-case 404 (`not-found.tsx`). |

---

## 2. PENDING — CLAUDE CODE

**None.** Every defect surfaced in Phases 1–3 is fixed or accepted-with-rationale:
- **D19** (eyebrow numeric-index prop unused): accepted — all eyebrows render consistently via the `Eyebrow` component; the `· 01` index stays an available option; ad-hoc compound labels are valid, not drift. No numeric-index churn imposed.
- **D20** (service tagline vs industry intro): accepted — a cross-family difference; the bar is intra-family identity, which holds.
- **D22** (secondary CTA on green closing band): accepted — consistent across the family by rule; primary orange is reserved for on-canvas hero/nav.
- **C12** (comma-splice → em-dash polish): deferred — optional stylistic only; left to avoid over-editing the established voice.

---

## 3. PENDING — HUMAN

Consolidated and de-duplicated from `10/11/12-*.md`, `docs/BLOCKERS.md`, and `09-phaseC-report.md`.
Nothing here blocks the build; each ships with a clearly-labelled placeholder.

### A. Client inputs (content/assets)
| # | Item | Owner | What unblocks it | Ref |
|---|---|---|---|---|
| H1 | **Real testimonials** — now **safe role-based placeholders** (realistic quotes, no invented person/company names; marked `// PLACEHOLDER`, listed in `PLACEHOLDERS.md`) | Client | Supply real, attributable, client-approved quotes (do NOT polish placeholders to sound credible) | C13, BLOCKERS #3 |
| H2 | **"50+ enterprise clients"** — **RESOLVED:** unverifiable claim removed; stats tile now the verifiable "8 · Industries served"; about/author prose rephrased | Client (optional) | Supply a *verified* client count to add it back as a stat | C14 |
| H3 | **Report data** — "key findings" on the 2026 report are illustrative under a "What the data shows" heading | Client | Provide real survey/portfolio data before it is cited; or soften the framing | C15, BLOCKERS #6/#10 |
| H4 | **Reseller authorisation** per partner logo (Microsoft, HP, Dell, Cisco, Lenovo, Fortinet) | Client + Legal | Written authorisation before public use of each brand mark | BLOCKERS #2/#9 |
| H5 | **Legal sign-off** on Privacy & Terms (currently "DRAFT — counsel review required") | Client's counsel | Counsel review + final copy | BLOCKERS #7 |
| H6 | **Real photography** — team/project photos; **report cover images** (`public/images/reports/<slug>.jpg`); the client's dedicated hero photos drop into `HeroCarousel.tsx` (5 lines) | Client | Supply assets; swap placeholders | BLOCKERS #8/#11, C-hero |
| H7 | **Ghana-targeted draft articles** (2, `draft:true`, currently 404) off-brand for a Nigeria-only company | Content lead | Keep unpublished, relocalise to Nigeria, or move to a separate property | C16 |
| H8 | **19 content-engine drafts** reference cover images that don't yet exist (paths 404) | Content lead | Curate a 1600×900 cover per slug before flipping `draft:false` | BLOCKERS update |

### B. Accounts / environment keys (integrations ship as env-gated stubs — no code change to enable)
| # | Item | Env | Ref |
|---|---|---|---|
| H9 | **Email** (lead notifications) | `RESEND_API_KEY` (or `SMTP_*`) | BLOCKERS #12 |
| H10 | **Email marketing** (Brevo/Mailchimp) | `MARKETING_API_KEY` + `MARKETING_LIST_ID` | BLOCKERS #13 |
| H11 | **CRM** (HubSpot or client CRM) | `CRM_WEBHOOK_URL` (or `CRM_API_KEY`) | BLOCKERS #14 |
| H12 | **Analytics** (Plausible/Fathom/GA4) | `NEXT_PUBLIC_ANALYTICS` | BLOCKERS #15 |
| H13 | **Lead persistence** (Supabase) | `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (run `supabase/migrations/0001_leads.sql`) | BLOCKERS #16 |
| H14 | **Rate limiting** (Upstash Redis) | `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | BLOCKERS #17 |

### C. Ops / deployment
| # | Item | Owner | What unblocks it | Ref |
|---|---|---|---|---|
| H15 | **Canonical host** — apex vs `www`; enforce one host via redirect | DevOps | Decide host; set `siteConfig.url` + DNS/redirects | 11-seo PENDING |
| H16 | **Production deploy** (Vercel) + domain | DevOps | Connect domain; deploy (branch is deploy-ready; do NOT merge until client review) | 09-phaseC |
| H17 | **Search Console / Bing** — submit sitemap, verify property, watch Coverage + field CWV | SEO/DevOps | Post-deploy | 11-seo PENDING |
| H18 | **Google Business Profile** for Abuja HQ (Lagos/PH if staffed) matching NAP exactly | Client | Create/claim listing | 11-seo PENDING |
| H19 | **In-browser Lighthouse (Perf ≥90 mobile, SEO ≥95) + axe (a11y)** on the deployed preview | QA | Run once imagery + preview are live | 09-phaseC |
| H20 | **External schema validation** (Google Rich Results + schema.org) on live URLs | SEO | Post-deploy | 11-seo PENDING |
| H21 | **Vercel Deployment Protection** — recheck the setting so stakeholders can view the preview | DevOps | Adjust project setting | 09-phaseC |
| H22 | **Designed OG social card** (1200×630) to replace the generated template | Design | Supply art | 11-seo PENDING |

---

## Final verification (re-run on the production build, `localhost:3210`)

All green or explicitly ledgered:
- `next build` succeeds; all routes prerender (71-URL sitemap). ✅
- Exactly one `<h1>` per page; heading order logical (h1→h3 skips fixed). ✅
- Titles ≤60 / descriptions 140–160 on **20/20** pages; `/reports` emits og:image. ✅
- JSON-LD valid for every type in use (Organization, WebSite, Service, FAQPage, BreadcrumbList, Article/BlogPosting, LocalBusiness); NAP matches footer. ✅
- robots 200; 404 route → branded page at HTTP 404; canonicals self-referencing. ✅
- No invalid focus token (`accent-green-300`) in output; no orange-as-ink class; primary button uses the dark (`accent-foreground`) label. ✅
- Stats show "2022"; no "8+ years"/false tenure claim; testimonials still labelled illustrative (H1). ✅
- In-browser Lighthouse/axe, live schema validators, and field CWV → **H19/H20** (need the deployed preview).

**Do not merge.** The client merges PR #1 after reviewing this ledger.

## CI / deploy runbook note — "Failed to fetch Inter from Google Fonts" (added 2026-07-17)

**Symptom:** `npm run build` dies with `Turbopack build failed … next/font: error: Failed to fetch
\`Inter\` from Google Fonts` (and the same for JetBrains Mono).

**It is almost certainly not a real breakage.** `next/font/google` fetches at BUILD time. A single
transient DNS/network blip fails the fetch — and the failure is **memoised into `.next`, so it keeps
failing after the network recovers**. Observed here: `curl` to `fonts.googleapis.com/css2?family=Inter`
returned HTTP 200 and DNS resolved fine, while the build kept failing on the cached error.

**First response — before anyone debugs it as real:**
```bash
rm -rf .next && npm run build
```
That cleared it here on the first try.

**Escalation trigger:** if this recurs on **Vercel** builds (where you can't just clear a local cache),
stop retrying and **self-host the fonts via `next/font/local`**. The font files become repo assets, the
build stops depending on a third-party fetch at deploy time, and this failure mode disappears
permanently. That is the fix; clearing the cache is the workaround.
