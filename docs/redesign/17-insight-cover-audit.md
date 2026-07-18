# 17 — Insight cover audit (imagery policy #2)

**39 covers reviewed against the imagery policy** (services-over-faces; no
white-subject stock; Nigerian/Black subjects where people appear; correct
subject). **No swaps applied** — verdicts and reasons only, for the client to
approve before a follow-up batch. Every cover was viewed (montages:
`cov1.jpg` covers 1–20, `cov2.jpg` covers 21–39, delivered separately).

Verdict counts: **KEEP 24 · SWAP 9 · UNCERTAIN 6** (all UNCERTAINs later resolved to SWAP → 15 swapped).

The policy's own logic applies: covers that are pure infrastructure/objects
(racks, cabling, batteries, documents, concept renders) are ethnicity-neutral
and safe — that's most of the KEEPs. The SWAPs are almost all the same failure:
a close-up of **white hands** typing/writing/signing, or white workers in frame.

---

## SWAP — clear policy violations (9, incl. #37 wrong-subject)

| # | Slug | What it shows | Reason |
|---|---|---|---|
| 7 | consolidated-vs-reactive-it-purchasing | a white man at a laptop in a warehouse | white subject |
| 10 | how-the-lpo-process-works-for-public-sector-it | a white hand writing with a pen | white subject |
| 11 | how-to-build-a-three-year-it-roadmap | a white hand at a planning board | white subject |
| 12 | how-to-evaluate-it-vendors-in-nigeria | a white handshake in suits | white subjects + cliché |
| 14 | how-to-write-a-managed-services-scope-of-work… | white hands writing notes by a laptop | white subject |
| 25 | ndpr-compliance-for-it-teams | white hands typing on a laptop | white subject |
| 33 | refresh-or-repair-it-hardware-decision | white hands on PC hardware | white subject |
| 36 | structuring-a-multi-site-it-refresh | an open-plan office of white workers | white subjects |

**Plus one wrong-subject swap:**

| 37 | total-cost-of-ownership-for-enterprise-hardware… | a screen of **COVID-19 case data** ("Confirmed Cases by Country") | wrong subject entirely — nothing to do with TCO |

Suggested replacements (services-over-faces): for the white-hands covers, use
the same-topic infrastructure/object framing already proven safe elsewhere
(cabling, racks, documents, a Nigerian professional at work). For #37, a
naira/cost or hardware-depreciation object shot.

## UNCERTAIN — client call (6)

| # | Slug | What it shows | Why uncertain |
|---|---|---|---|
| 1 | a-pre-deployment-site-survey-framework… | laptop with code; a hand at the keyboard reads light-skinned | mostly the laptop, but the hand is borderline; also "code" ≠ "site survey" |
| 5 | building-an-it-disaster-recovery-plan… | a physically **wrecked trailer home** | a literal "disaster" — wrong register for IT/data DR; may read as odd |
| 20 | it-infrastructure-for-schools-and-universities | a computer lab of students who read as **South/East Asian**, not African | not white, but not Nigerian/Black either — policy prefers African subjects |
| 27 | nigeria-enterprise-it-trends-2026 | a vintage electronic control panel (dials/knobs) | dated-looking hardware for a forward-looking "2026 trends" piece |
| 38 | what-an-it-sla-should-cover | hands signing a document; skin tones mixed/unclear | contract-signing is apt; ethnicity of the hands is ambiguous |
| 39 | what-the-ndpr-means-for-nigerian-businesses | a dim office, people at laptops, backs turned | figures are ambiguous (could be Black); acceptable but not clearly on-policy |

## KEEP — audited OK (25)

Infrastructure / objects / concept (ethnicity-neutral, correct subject):
3 (document stacks), 4 (bank building), 6 (laptop/code), 8 (padlock/cyber),
9 (dark server room), 13 (lock metaphor), 15 (iMac desk), 16 (calculator+charts),
17 (desk), 18 (oil pump — correct subject), 19 (dark racks), 21 (atrium),
23 (ops/mission-control room), 24 (blue cables), 26 (patch panel), 28 (cloud
render), 29 (batteries/power), 30 (transformer — correct subject), 31 (monitoring
dashboard — apt for a monitoring piece), 32 (matrix/ransomware), 34 (racks),
35 (patch panel).

With people, but appropriate/obscured:
2 (business meeting, diverse/some Black), 22 (surgeons — gowned/masked, subject
obscured, correct medical context).

---

## Notes for the follow-up batch (when approved)

- The 8 SWAPs are the priority — white-subject stock on a Nigerian company's
  site is the clearest policy breach. Most can be fixed with same-topic
  infrastructure framing (no people needed), which also de-risks sourcing.
- For #20 and the UNCERTAIN people-shots, sourcing Nigerian/African subjects is
  possible but slower and higher-variance; the safe fallback is
  services-over-faces (equipment/context) per the policy's own guidance.
- Same process as the slot swaps: verify every candidate ID resolves 200 AND
  view each downloaded image against its topic before wiring. Update
  `public/images/insights/CREDITS.json`.

---

## APPLIED 2026-07-18 — all 15 swapped (client-approved rule)

The 8 SWAPs (plus #37 wrong-subject = 9) were approved. The 6 UNCERTAINs were
resolved by the client's rule: **no people + subject fits = KEEP; non-African
people OR subject mismatch = SWAP.** Rule applied to each:

| # | Slug | Rule application | Verdict |
|---|---|---|---|
| 1 | a-pre-deployment-site-survey… | light-skinned hand on keyboard = **non-African person**; also code ≠ site survey | SWAP |
| 5 | building-an-it-disaster-recovery… | no people, but a wrecked trailer = **subject mismatch** | SWAP |
| 20 | it-infrastructure-for-schools… | students read as **non-African** | SWAP |
| 27 | nigeria-enterprise-it-trends-2026 | no people, but a vintage control panel on a 2026 piece = **subject mismatch** | SWAP |
| 38 | what-an-it-sla-should-cover | signing hands read as **non-African** (viewed full-size) | SWAP |
| 39 | what-the-ndpr-means-for-nigerian… | office workers read as **non-African** (viewed full-size) | SWAP |

**All 15 replacements are no-people, topical images** — the safest branch of
the rule (subject fits, no geography question). Every replacement ID verified
HTTP 200 AND viewed in a montage against its slot before wiring; CREDITS updated.

| Slug | Replacement subject | Unsplash ID |
|---|---|---|
| a-pre-deployment-site-survey… | network nodes (survey/mapping) | photo-1644088379091-d574269d422f |
| building-an-it-disaster-recovery… | cloud backup / recovery | photo-1667372283496-893f0b1e7c16 |
| consolidated-vs-reactive-it-purchasing | stacked purchasing files | photo-1583521214690-73421a1829a9 |
| how-the-lpo-process-works… | official forms | photo-1554224155-1696413565d3 |
| how-to-build-a-three-year-it-roadmap | connected network mesh | photo-1644325349124-d1756b79dd42 |
| how-to-evaluate-it-vendors… | binders | photo-1468779036391-52341f60b55d |
| how-to-write-a-managed-services-scope… | paper stack (SOW) | photo-1516409590654-e8d51fc2d25c |
| it-infrastructure-for-schools… | computer training lab | photo-1643199187247-b3b6009bf0bb |
| ndpr-compliance-for-it-teams | padlock on keyboard | photo-1633265486064-086b219458ec |
| nigeria-enterprise-it-trends-2026 | glowing tech (future) | photo-1653549893012-b8b4fbe97630 |
| refresh-or-repair-it-hardware-decision | motherboard chip | photo-1675602488512-bdd631490fcb |
| structuring-a-multi-site-it-refresh | circuit board | photo-1518770660439-4636190af475 |
| total-cost-of-ownership… | calculator | photo-1611125832047-1d7ad1e8e48f |
| what-an-it-sla-should-cover | documents / agreement | photo-1562240020-ce31ccb0fa7d |
| what-the-ndpr-means-for-nigerian… | data mesh / privacy | photo-1590859808308-3d2d9c515b1a |

Banking building (industries slot): KEEP, noted as a future Nigerian-bank swap.
