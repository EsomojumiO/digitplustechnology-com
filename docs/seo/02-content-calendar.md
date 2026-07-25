# Content Calendar — the freshness engine

> The live cadence for Phase 4. Feeds off the approved backlog in
> `01-query-map-v2.md` and runs the monthly loop defined in
> `00-seo-operations.md`. Started 2026-07-25, after the first 5 articles shipped
> (backlog #1–#4 + the DR draft #13). Published count: 38.

## Cadence at a glance
- **2–3 new articles/month** from the top of the backlog.
- **One quarterly refresh pass** over the 10 oldest articles (first cycle: October 2026).
- **The next big linkable asset:** the H2-2026 report (Q4).
- Each item ships as its own gated commit to `main`; `npm run gates` green before push.

## Publishing schedule (rolling 3 months)

### August 2026 — 3 articles
| Backlog # | Article | Pillar |
|---|---|---|
| 5 | Bank branch IT setup cost in Nigeria | Banking / infrastructure |
| 6 | Break-fix vs managed IT services | Managed Services |
| 9 | Structured cabling cost in Nigeria | Infrastructure |

### September 2026 — 3 articles
| Backlog # | Article | Pillar |
|---|---|---|
| 11 | Cloud vs on-premise for Nigerian businesses | IT Strategy |
| 10 | IT support for hospitals in Nigeria | Healthcare |
| 19 | How to choose a managed IT service provider in Nigeria | Managed Services |

### October 2026 — 3 articles + **Q3 quarterly refresh**
| Backlog # | Article | Pillar |
|---|---|---|
| 14 | School computer lab setup cost in Nigeria | Education |
| 16 | Warranty & AMC for IT equipment in Nigeria | Hardware Supply |
| 15 | IT asset disposal & decommissioning in Nigeria | Managed Services |

Plus the first **quarterly refresh pass** (see below).

### November–December 2026 — decisions + the big asset
- **City × service landings (#7, #8, #12, #21).** Do NOT auto-build 21 doorway pages. Decide the 2–3 highest-volume combos (start: *managed IT services in Lagos*, *IT procurement company in Abuja*) and build each with genuine local substance to the Phase 1.1 bar. Gate: one decision, then build.
- **H2-2026 report** — the next major linkable asset and best backlink magnet. Scope in Q4; the report format and lead route already exist.

> Every cost/comparison article added above follows the mechanism-first rule
> (drivers, not price tables; dated named-basis figures only) and uses a branded
> typographic cover unless it has a real physical subject worth a photo.

## The monthly loop (every month, in addition to publishing)
Full step-by-step is in `00-seo-operations.md` §"The monthly loop". In brief:
1. Pull GSC (last 28 days) → Queries + Pages.
2. Find **striking distance** (position 5–20).
3. Diagnose each (query in H1/first 100 words? thinner than pages above it? inbound links?).
4. **Strengthen those specific pages** (depth, H1/intro, 2–3 inbound internal links with descriptive anchors).
5. Publish the month's new article(s).
6. Measure next month; feed back into step 2. Log movement here.

## Quarterly refresh pass (first cycle: October 2026)

### 1. The 10 oldest articles — refresh depth, links, and `dateModified`
| Published | Article |
|---|---|
| 2025-10-07 | complete-guide-to-it-procurement-in-nigeria |
| 2025-10-15 | how-the-lpo-process-works-for-public-sector-it |
| 2025-10-28 | how-to-evaluate-it-vendors-in-nigeria |
| 2025-11-03 | structured-cabling-standards-for-nigerian-offices |
| 2025-11-10 | consolidated-vs-reactive-it-purchasing |
| 2025-11-18 | designing-a-server-room-power-cooling-ups |
| 2025-11-25 | lan-wan-design-for-multi-branch-businesses |
| 2025-12-01 | power-protection-and-ups-planning |
| 2025-12-10 | network-installation-checklist-new-office |
| 2026-01-05 | what-an-it-sla-should-cover |

For each: update any stale facts, add internal links pointing *in* from newer articles, and bump `updatedAt` (`dateModified`) only when the content genuinely changed.

### 2. ⚠️ FX-framing re-verification — **required, not optional**
Every article carrying a dated "as at Qx" currency claim must have that claim re-verified each quarter, because naira volatility makes a stale FX statement actively misleading in a cost article — the exact trust the page exists to build. **This is a checklist item, not a note; it cannot be skipped.**

**Re-verify every "as at Qx" claim** in these articles (current list — regenerate with `grep -rilE "as at q[0-9]|q[0-9] 20" content/insights/*.mdx`):
- [ ] `cost-of-setting-up-a-server-room-in-nigeria`
- [ ] `it-budget-for-opening-a-new-office-in-nigeria`
- [ ] `leasing-vs-buying-it-equipment-in-nigeria`

For each: confirm the "as at Qx 20xx" reference still reflects the current quarter's reality. If the framing still holds, advance the quarter label and bump `updatedAt`. If conditions changed materially, rewrite the claim. **A cost article with a stale "as at" date is a defect to fix this pass, not next.**

## Measurement log
_(Append monthly: which striking-distance pages were strengthened, and whether they moved.)_
