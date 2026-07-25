# SEO Operations — the standing runbook

> The site is live, technically sound, and content-deep. This runbook turns that
> into a ranking operation. It ties the four phases together and documents the
> monthly loop that compounds. Start date: 2026-07-25.

## Ground rules (do not violate — these outrank any ranking tactic)
- **Voice first.** Specificity ranks *and* converts; keyword-stuffing does neither. The anti-AI-tell standard is law.
- **No invented anything.** No fabricated stats, reviews, or schema for things that don't exist — that is a manual-action risk, not a growth hack.
- **One primary query per page.** A new page must claim an *unclaimed* query from `01-query-map-v2.md` or it doesn't get built.
- **Lane discipline.** Authority/top-of-funnel only. Cost content = budgeting and cost-drivers, never a price list. Prices live on the store.
- **Both gates green on every commit; deploy via push to `main`.**

---

## Phase status

| Phase | Item | Status |
|---|---|---|
| **1.1** | Location pages → real local depth (~700w, FAQPage schema, areas/logistics/sectors) | ✅ **Shipped** `3daa4ce` |
| **1.2** | Industry pages → body prose + 5 related insights each (0 broken links) | ✅ **Shipped** `7d5f9f4` |
| **1.3** | `/insights` dead-end → bottom category nav + closing CTA | ✅ **Shipped** `d36ecf3` |
| **2.1** | Rebuild keyword→page map against the live site | ✅ **Done** — `01-query-map-v2.md` |
| **2.2** | Ranked backlog (24 opportunities) + STOP for review | ✅ **Approved as ranked** (2026-07-25) |
| **2.3** | Write first 4 backlog articles + ship the DR draft (#13) | ✅ **Shipped** — 5 articles (`76f408b` DR, `c506923` the four cost/comparison). Published count 33 → 38. |
| **3** | Technical SEO enhancements | 🟡 **In progress** — internal-link gate ✅ shipped (`447421e`); schema audit, Service areaServed, OG sweep, RSS still queued (below) |
| **4** | Freshness engine (content calendar + monthly GSC loop) | ⏳ **Queued** — cadence defined below |

---

## Phase 3 — technical SEO (queued, honest-only)

Actionable now, independent of the 2.2 gate. Each ships as its own gated commit.

- [ ] **Article schema audit** — confirm every published insight emits `Article`/`BlogPosting` with `author` + `datePublished`/`dateModified`; reports carry the right type. (Spot-checks pass; needs a full sweep.)
- [ ] **Service `areaServed`** — add Abuja/Lagos/Port Harcourt to `serviceSchema` (currently `areaServed: Country=Nigeria` only); add `hasOfferCatalog` **only where the catalogue is real** (the 4 sub-capabilities per service qualify; don't invent SKUs).
- [ ] **Breadcrumb schema** — verify `BreadcrumbList` on every nested route (services, industries, locations, insights, categories, reports). Present on the templates checked; needs the full 71-URL sweep.
- [ ] **OG images** — verify the top-10 shared-likelihood pages have a valid, non-duplicate OG image (home, services hub, the 6 service pages, top articles).
- [x] **Internal-link audit script** ✅ **Shipped** — `scripts/internal-link-audit.mjs`, wired into the suite as `npm run gates` (a 4th gate beside conformance/a11y/contrast). Every indexable page must have ≥1 inbound internal link, sit ≤3 clicks from home, and be linked with a descriptive anchor. It crawls pagination so page-2+ listings aren't mis-flagged. **On its first run it caught a real orphan cluster** — the entire `/locations` sub-tree (overview + 3 cities) had no inbound link from anywhere reachable from home; fixed by adding Locations to the footer.
- [x] **hreflang** — **skip.** Single-locale site (en-NG only); adding hreflang would be noise. Decision recorded here per the brief.
- [ ] **RSS feed for `/insights`** — `/insights/rss.xml` from `getAllArticles()`; link via `<link rel="alternate" type="application/rss+xml">` in the insights head.

---

## Phase 4 — the freshness engine (the compounding loop)

Cadence and the monthly loop are defined here; the live calendar is
`02-content-calendar.md` (created when Phase 2.2 is approved and the first cycle
starts, so the dates are real, not speculative).

**Cadence**
- **2–4 articles/month** from the approved backlog, newest-first by rank.
- **Quarterly refresh** of the 10 oldest articles (update stats, add internal links pointing *in*, refresh `dateModified`).
- **The next big linkable asset:** the **H2-2026 report** — the highest-authority artefact we can publish and the best backlink magnet.

### The monthly loop (step by step)
Run once a month. Each step is concrete so it survives a handover.

1. **Pull GSC data.** Search Console → Performance → last 28 days → export Queries + Pages. (Needs the verified property; verification is already done.)
2. **Find striking distance.** Filter to pages/queries ranking **position 5–20** — close enough that a focused push moves them onto page one. This is where effort pays back fastest; ignore position 1–4 (won) and 30+ (needs a new page, not a tweak).
3. **Diagnose each striking-distance page.** For each, ask: is the target query in the H1 + first 100 words? Is the content thinner than the pages ranking above it? How many internal links point *at* it, with what anchors?
4. **Strengthen those specific pages.** Add depth where thin, tighten the query into the H1/intro if missing, and **add 2–3 internal links pointing at the page** from related articles/pillars with descriptive anchors. Small, surgical, measurable.
5. **Publish the month's new article(s)** from the backlog, full editorial standard (operator specificity, real mechanisms, byline from the author registry, verified cover per the imagery policy, up-link to the parent pillar).
6. **Measure next month.** Did the strengthened pages move? Feed the answer back into step 2. Log what moved in `02-content-calendar.md`.

**Rule:** every loop touches *specific pages with evidence*, never "write more and hope." Striking-distance work is cheaper than net-new ranking and compounds.

---

## Editorial standard (every new article)
1. Claims an unclaimed query from `01-query-map-v2.md`; that query is in the H1 + first 100 words + meta title/description.
2. Operator specificity — real mechanisms, real Nigerian constraints (power, LPO, multi-site, connectivity), no generic filler.
3. Author byline from the registry (`src/data/authors.ts`); `publishedAt`/`updatedAt` set.
4. Verified, viewed cover image per the standing imagery policy (no wrong-country, no scene the alt describes but the photo doesn't show).
5. Up-links to its parent pillar and 2–4 sideways links to sibling articles; earns at least one inbound link from an existing page (no orphans).
6. `draft: false` only when all of the above hold and both gates are green.

## Re-running the gates
```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"
npm run build && npx next start -p 4310 &
npm run gates            # runs all 4: conformance · a11y · hero-contrast · internal-link-audit
# individually: npm run gate:conformance | gate:a11y | gate:contrast | gate:links
```

## Out of scope (human / off-site — not this runbook)
Search Console/Bing verification (done) · Google Business Profile optimisation +
review generation · directory citations (VConnect, ConnectNigeria, Finelib,
LinkedIn) · partner-locator backlinks (needs reseller confirmation) · paid-tool
decisions. Tracked in the launch runbook §C, not here.
