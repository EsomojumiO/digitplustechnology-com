# 16 — Copy refinement + CTA map (#3 / #4)

Copy changes are authorised this round (exception to visual-only). This is the
old→new deck for audit.

## Scope note — most of the copy was already operator-grade

The phase-12 copy audit (`12-copy-audit.md`) already did the heavy lifting: the
detailed service and industry copy is concrete and Nigeria-specific — "authorised
distribution, no grey imports", "LPO fulfilment", "manufacturer warranties and
verifiable provenance", "we do not deal in grey-market stock", "Abuja, Lagos,
Port Harcourt". A scan for the classic AI tells ("seamless", "cutting-edge",
"empower", "unlock", "leverage", "world-class", "robust") returns **nothing** in
user-facing copy. So this pass sharpens the handful of remaining vague
page-level ledes rather than rewriting good copy — rewriting the strong parts
would risk making them worse.

## Copy: old → new

| Where | Old | New | Why |
|---|---|---|---|
| Home · industries lede | "Every sector has its own demands. We deliver to each." | "A hospital can't absorb the downtime a warehouse can. We size, document and support the work to each sector's constraints." | vague claim → a concrete operator contrast (uptime tolerance) |
| Home · services lede | "Start with one capability; grow into the rest." | "Procurement, infrastructure, deployment, support. Start with one; we grow into the rest as you need us." | names the actual lifecycle instead of an abstract "capability" |
| Home · process lede | "Six steps, the same discipline every time." | "Discovery to handover, six steps, the same documentation and sign-off every time." | ties "discipline" to the checkable artefacts (documentation, sign-off) |
| About · lede | "…take the uncertainty out of IT… the discipline that serious operations require." | "…make enterprise IT in Nigeria predictable: one accountable partner from plan to support, genuine authorised-channel hardware, and delivery documentation your auditors will accept." | drops two soft phrases; adds three checkable specifics (authorised-channel, auditors, plan-to-support) |

Everything else audited and left as-is (already specific). The hero carousel's
per-slide copy — written in #1 — is operator-grade by construction ("Genuine
hardware, documented", "Networks built once, done right", "Authorised channels,
OEM warranties, audit-ready records").

## CTA map (#4) — one intent, one label, sitewide

Canonical source: `src/lib/cta.ts`. The old site used "Get a quote" on every
page; it's now **retired** and the conformance gate fails any page that
reintroduces it.

| Page type | Primary CTA label | Destination |
|---|---|---|
| Home hero — conversion slide | **Get a proposal** | /contact |
| Home hero — other slides | Explore managed IT · See how we deploy · … | the service |
| Service detail | **Request a proposal** | /contact |
| Industry detail | **Talk to a {sector} specialist** (e.g. "…a government specialist") | /contact |
| Location detail | **Reach our {city} office** (e.g. "…our Abuja office") | /contact |
| Insights / articles | **Get this working in your business** | relevant service |
| Contact (form submit) | **Send your brief** | — |
| Header nav + mobile menu | **Start a conversation** | /contact |
| Generic pages (about, approach, ecosystem, index hubs, 404, home closing band) | **Start a conversation** | /contact |

Rules honoured: one intent → one label sitewide; labels are verb + object
(the two dynamic ones, "Talk to a … specialist" / "Reach our … office", follow
the brief's explicit wording even though they run past 4 words); **one orange
fill per viewport** still holds — the primary CTA is the only fill, secondary
placements are hairline pills or ink chevron links.

## Gate encoding (drift protection)

Two checks added to `scripts/style-conformance.ts`, both proven to fire (a first
run caught real leftovers before they were fixed):

1. **scrim-outside-hero** — a dark gradient over a photo is allowed ONLY inside
   the hero carousel (`[aria-roledescription="carousel"]`). Anywhere else it's
   the dark-theme scrim idiom returning. This caught two Phase-3 leftovers
   (`ContentShelf`, `ArticleCard` still carried `from-background/70` — a white
   veil over the card image on the light canvas); both removed.
   The check requires a real dark alpha (≥ 0.1), not the `to-transparent` end of
   a fade (which serialises as `rgba(0,0,0,0)` and would false-positive).
2. **cta-retired / cta-offmap** — fails any rendered "Get a quote", and requires
   every primary (orange-fill) CTA label to come from the canonical map (the
   dynamic specialist/office labels matched by prefix). This caught the header
   and mobile-menu CTAs, which still said "Get a quote".
