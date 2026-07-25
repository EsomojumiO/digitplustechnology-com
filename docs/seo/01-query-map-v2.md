# Query Map v2 — coverage + ranked backlog

> Built against the **live** site (sitemap: 71 URLs) on 2026-07-25, after the
> Phase 1 content-depth work landed. This is the Phase 2.1/2.2 deliverable.
>
> **⛔ STOP GATE (Phase 2.2).** No new content is written from this backlog until
> the client reviews and approves the map. The four recommended articles at the
> bottom are proposals, not commitments. Nothing below has been built.

One primary query per page remains law. A new page is only built if it claims an
**unclaimed** query from this map. Cost/pricing items stay in the authority lane:
we publish *what drives the cost* and *how to budget*, never a price list — prices
belong on the store (thedigitplus.com), never here.

---

## A. Current coverage (what each commercial page already claims)

### Service pillars — `/services/*` (H1 = claimed query)
| Page | Primary query (claimed in H1 + first 100 words) |
|---|---|
| `/services` | IT solutions in Nigeria |
| `/services/it-procurement` | IT procurement in Nigeria |
| `/services/hardware-supply` | IT hardware supply in Nigeria |
| `/services/infrastructure-solutions` | IT infrastructure in Nigeria |
| `/services/managed-services` | managed IT services in Nigeria |
| `/services/technology-advisory` | IT consulting and advisory in Nigeria |
| `/services/deployment-implementation` | IT deployment in Nigeria |

### Industry pages — `/industries/*` (now with body prose + related insights, Phase 1.2)
| Page | Primary query |
|---|---|
| `/industries/government` | government IT in Nigeria |
| `/industries/banking-financial-services` | banking IT in Nigeria |
| `/industries/enterprise` | enterprise IT in Nigeria |
| `/industries/sme` | IT for SMEs in Nigeria |
| `/industries/healthcare` | healthcare IT in Nigeria |
| `/industries/education` | education IT in Nigeria |
| `/industries/oil-gas-energy` | oil and gas IT in Nigeria |
| `/industries/logistics-manufacturing` | logistics and plant IT in Nigeria |

### Location pages — `/locations/*` (now ~700 words each, Phase 1.1)
| Page | Primary query |
|---|---|
| `/locations/abuja` | IT company in Abuja |
| `/locations/lagos` | IT company in Lagos |
| `/locations/port-harcourt` | IT company in Port Harcourt |

### Content cluster
- `/insights` hub + **33 published articles** across 7 categories (informational/top-of-funnel).
- `/reports` + 2 assets (`state-of-enterprise-it-in-nigeria-2026`, `nigeria-enterprise-it-hardware-price-index-q2-2026`).
- Brand/non-commercial: `/`, `/about`, `/approach`, `/contact`, `/ecosystem`, `/privacy`, `/terms`.

### The shape of the gap
Coverage is strong on **`[service] in Nigeria`** and **`[sector] IT in Nigeria`**,
and the 33 articles cover most informational procurement/infra/security topics.
Three commercial-intent seams are **wide open**:
1. **Cost/budget intent** — highest commercial intent of all, and we publish almost none of it in "what does X cost / how to budget for X" framing.
2. **City × service** — `IT company in <city>` is claimed, but `<service> in <city>` (e.g. "managed IT services Lagos") is claimed nowhere.
3. **Decision/comparison** — a few exist (in-house vs outsourced, refresh vs repair, consolidated vs reactive) but obvious high-intent ones (lease vs buy, break-fix vs managed, cloud vs on-prem) are missing.

---

## B. Ranked backlog — 24 unclaimed opportunities

Ranked by **commercial intent × winnability × strategic fit**. `Type`: article
(insight), landing (new commercial page), or publish-draft. Blocked items are
kept in rank order but cannot start until the blocker clears.

| # | Query | Intent | Type | Why it wins |
|---|---|---|---|---|
| 1 | cost of setting up a server room in Nigeria | High (cost) | Article → Infrastructure pillar | Cost intent + we already rank-adjacent with the server-room design article to interlink; near-zero authority competition in NG. |
| 2 | what managed IT services cost in Nigeria (and what drives the price) | High (cost) | Article → Managed Services | Buyers price-check before RFP; up-links to `/services/managed-services`; lane-safe (cost drivers, not a rate card). |
| 3 | IT budget for opening a new office in Nigeria | High (cost) | Article → IT Strategy | Complements `network-installation-checklist-new-office`; captures the "new office" buyer at budgeting stage. |
| 4 | leasing vs buying IT equipment for a Nigerian business | High (decision) | Article → Procurement | Classic high-intent comparison with no NG authority answer; routes to procurement + advisory. |
| 5 | bank branch IT setup cost in Nigeria | High (cost) | Article → Banking | Pairs with `budgeting-bank-branch-infrastructure` + `it-checklist-for-opening-a-new-bank-branch`; strong sector cluster. |
| 6 | break-fix vs managed IT services | High (decision) | Article → Managed Services | Directly sells the managed-services pillar; the query is the buyer talking themselves into a contract. |
| 7 | managed IT services in Lagos | High (city×service) | Landing (Lagos × managed) | Commercial city+service with no page; Lagos = highest search volume. Needs a landing pattern (see §C note). |
| 8 | IT procurement company in Abuja | High (city×service) | Landing (Abuja × procurement) | Our HQ city + our strongest service; local-pack adjacent once GBP lands. |
| 9 | structured cabling cost in Nigeria | High (cost) | Article → Infrastructure | Up-links to `structured-cabling-standards`; costed framing is the missing half. |
| 10 | IT support for hospitals in Nigeria | Med-high (sector×service) | Article/Landing → Healthcare | Pairs with `it-setup-guide-for-hospitals-and-clinics`; "support" is more commercial than "setup". |
| 11 | cloud vs on-premise for Nigerian businesses | Med-high (decision) | Article → IT Strategy | High-volume decision query; power/connectivity realities give us a genuinely local angle. |
| 12 | IT support company in Port Harcourt | Med-high (city×service) | Landing (PH × managed) | Completes the three-city × service set; energy-corridor angle differentiates. |
| 13 | disaster recovery plan for Nigerian businesses (power-first) | Med-high | **Publish-draft** → Infrastructure | A draft already exists (`building-an-it-disaster-recovery-plan…`); needs review + cover, not new writing. Cheapest win on the list. |
| 14 | school computer lab setup cost in Nigeria | Med (cost/sector) | Article → Education | Pairs with `it-infrastructure-for-schools-and-universities`; budget-led education buyer. |
| 15 | IT asset disposal & decommissioning in Nigeria | Med | Article → Managed Services | Unserved topic; NDPR data-wipe angle ties to existing compliance articles. |
| 16 | warranty & AMC for IT equipment in Nigeria | Med | Article → Hardware Supply | "AMC" is a common NG procurement term with no authority answer; up-links to hardware + managed. |
| 17 | network setup for a new bank branch in Nigeria | Med (sector×service) | Article → Banking | Sharper commercial cut of the existing branch cluster; strengthens the banking topic authority. |
| 18 | IT support for oil & gas companies in Nigeria | Med (sector×service) | Landing → Oil-Gas | "Support" commercial intent on top of the existing `it-for-oil-gas-and-energy-operations` guide. |
| 19 | how to choose a managed IT service provider in Nigeria | Med (decision) | Article → Managed Services | Buyer-selection query; mirror of the vendor-evaluation article aimed at MSPs. |
| 20 | IT procurement for schools & universities in Nigeria | Med (sector×service) | Article → Education | Education + procurement crossover, currently unserved. |
| 21 | structured cabling company in Lagos | Med (city×service) | Landing (Lagos × infra) | Second Lagos city×service; high commercial intent, physical-work query. |
| 22 | Dell / HP / Cisco authorised reseller in Nigeria | High (brand) | Landing | **⛔ BLOCKED — needs reseller authorisation confirmation (launch runbook §C.12).** Do not publish reseller claims without proof; manual-action + trademark risk. |
| 23 | Microsoft / Fortinet partner in Nigeria | High (brand) | Landing | **⛔ BLOCKED — same authorisation gate as #22.** |
| 24 | IT company near me / IT services in <satellite town> | Low-med (local) | Depends on GBP | **⛔ Deferred — depends on Google Business Profile + street address (runbook §C.10/§C.11).** Local-pack, not on-page, work. |

---

## C. Notes for the review

- **City × service pages (#7, #8, #12, #21) are a decision, not a default.** They
  win the query but risk thin near-duplicates of the location pages if done
  lazily. Recommended pattern: a real `/locations/<city>` section OR a
  `/services/<service>` city-qualified block, each with genuinely local substance
  (the Phase 1.1 bar). Flag: do **not** spin up 3×7 = 21 doorway pages. Pick the
  2–3 highest-volume combos and build them properly.
- **Blocked items (#22–#24)** stay in the backlog for visibility but are gated on
  human/off-site inputs already tracked in the launch runbook. They are *not*
  candidates for the first writing round.
- **Lane check passed:** every cost item is framed as budgeting/cost-driver
  authority content, not pricing. None cannibalises the store.

---

## D. Recommended first 4 (Phase 2.3 — pending approval)

Chosen for highest commercial intent, winnability today, authority-lane safety,
and because each up-links cleanly into an existing pillar (no orphans):

1. **#1 — Cost of setting up a server room in Nigeria** → Infrastructure
2. **#2 — What managed IT services cost in Nigeria (and what drives the price)** → Managed Services
3. **#4 — Leasing vs buying IT equipment for a Nigerian business** → Procurement
4. **#3 — IT budget for opening a new office in Nigeria** → IT Strategy

Cheapest alternative worth swapping in: **#13 (publish the existing DR draft)** —
it's review-and-ship, not net-new writing, so it could run *alongside* the four
above at near-zero marginal cost.

**Awaiting client approval of this map before any writing begins.**
