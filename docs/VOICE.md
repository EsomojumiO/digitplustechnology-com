# VOICE.md — how this site should sound

**Part 1** is the target voice. **Part 2** is the AI-tell checklist, with counts
measured across this corpus. One rule governs both: **if a sentence reads better
with the tell removed and nothing put back, remove it and put nothing back.**
Cutting is the cheapest way to sound human.

## Evidence key

Every rule carries the sample it comes from:

- **BOTH** — visible in the written and the spoken sample. Strongest.
- **SPOKEN** — from ~2,200 words of transcribed calls.
- **WRITTEN** — from ~150 words of site prose.
- **PROVISIONAL — UNVERIFIED** — neither sample answers it. A proposal to be
  corrected, not a finding.

## The two samples

**Written (~150 words).** `esofesola.com/src/app/about/page.tsx`,
`what-i-run/page.tsx`, and the `standing` lines in `src/site.ts`. There are no
essays: `content/essays/` holds only `.gitkeep`, no essay was ever committed,
and the domain does not resolve.

**Spoken (~2,200 words).** Three recorded calls — two sales/advisory, one
internal technical — at `~/voice-samples/spoken.md`, **deliberately outside this
repository** because it quotes client names and deal values. Do not copy it in
or re-create it under `docs/`.

Speaker attribution in that file was established per meeting and confirmed by
the owner. It matters that it was checked: the transcripts label turns
`Speaker 1`/`Speaker 2` and **the numbering is not stable between meetings**.

> **Examples below are redacted.** Client names, company names and deal values
> are replaced with `[bracketed generics]`. Everything outside brackets is
> verbatim, including false starts and repetition.

---

# Part 1 — The voice

## 1. Name the number, with its unit — BOTH

The single strongest signal across both samples. Nothing is left as a general
quantity when a specific one exists.

SPOKEN:

> "Each of these GPUs, it needs about 600 watts of power. So for one GPU, we
> might decide to put a 1000-watt power supply, but for a 2 GPU, it has to be
> like 1350 or 1650."

> "Low power, the maximum wattage like 85 watts."

> "With like 8GB RAM and 256GB, they are not going to be—"

WRITTEN: "Five of them", "during COVID", "since last year".

DO: "a UPS on each critical station buys enough runtime to save open work."
Better: name the runtime.
DON'T: "significant power savings", "enterprise-grade capacity", "improved
performance".

## 2. Refuse the general answer; name the variable that decides it — SPOKEN

The most distinctive move in the spoken sample. Asked "how much" or "will it
work", the answer is not a number or a yes — it is the thing you would have to
know first.

> "So it all depends on the workflow, to be honest."

> "I mean, it depends on your solar capacity. So how many kVA is the inverter?
> All these type of things."

> "Uh, not necessarily as high as 10 kVA depending on the load that is already
> in the office currently."

This is already how the best article on the site works — the server-room piece
refuses a naira figure and explains what drives it. Make it the default shape
for any "how much" or "which should I buy" section.

## 3. Say no flatly, then give the reason — BOTH

No softening, no "I think perhaps". The correction comes first, the reason
second.

SPOKEN:

> "No, we can't use the [NAS device]. The [NAS device] is, uh, network attached
> storage, so that one is majorly for you."

> "No, it doesn't have to be the paid version."

WRITTEN:

> "This is not a site about how to build a business. I do not know enough for
> that."

Note the shape: a plain negation followed by a **reason**, never a mirrored
"it's Y". See Part 2 §7.

## 4. State the limit of what you know — BOTH

SPOKEN:

> "We don't really know— we are the hardware guys. We don't really know the size
> of the language models they are going to be running on those servers."

> "I don't know where exactly how they want to route, you know, the data
> transfer and all those things."

WRITTEN:

> "I do not know enough for that."

This *replaces* hedging rather than being a form of it. "We do not know X, so we
sized for Y" is a strong sentence. "This may help to optimise your outcomes" is
not. See Part 2 §6.

## 5. Talk the reader down from the expensive option — SPOKEN

He argues against his own upsell, repeatedly, and marks it with an honesty
signal.

> "2.5 is, it's honestly fast also."

> "So most motherboards come with 2.5, not 10 gig. If you know that 10 gig is a
> hardcore requirement, you can always get a 10 gig Ethernet, uh, motherboard
> for you."

> "Uh, not necessarily as high as 10 kVA…"

The site's procurement articles already do this ("that is money set on fire").
Keep it. It is the most trust-building thing in the sample and it costs nothing.

## 6. Offer two options, not three — BOTH

Both samples enumerate. Neither lands on three.

SPOKEN:

> "So there are 2 ways you can set that up. One, we can use a spare computer to
> act as a server… But the other solution, which is the network attached
> storage, it's like a local [cloud drive]…"

> "I can send you 2 options— how much it costs with 1 GPU and how much it costs
> with 2 GPUs."

WRITTEN — a five-item list where most writers would cut to three:

> "under one group: IT infrastructure, custom computer hardware, media,
> children's retail, logistics"

Write the number of options that actually exist. Two is common; five is fine.
Three-because-it-sounds-finished is the corpus's single biggest tell, at 472
instances.

## 7. State the trade-off with its cost attached — SPOKEN

Never a benefit without what it takes.

> "If you use 10 gig, you might have to add network card, but if you are using 2
> GPUs, there might not be a space for network card."

> "the power requirement for one GPU is different from 2"

DO: name what the choice costs — space, watts, weeks, naira.
DON'T: list benefits and leave the constraint to the reader.

## 8. Local conditions as ordinary engineering input — BOTH

Never as hardship, never as colour.

SPOKEN:

> "because usually [the local mobile networks] might not be strong enough, so
> the collaboration might be a bit slower than what they will experience if they
> are in the office"

> "So how many kVA is the inverter?"

WRITTEN: "I build companies in Abuja." Flat statement, no scene-setting.

Grid, naira, inverter sizing and import lead time are inputs to a calculation.
Not adversity, not atmosphere.

## 9. Punctuation — WRITTEN only

**Zero em dashes, zero semicolons in the written sample.** Speech cannot inform
this: dashes in a transcript are the transcriber's, not the speaker's. This rule
rests on the 150 words alone, and on the corpus measurement in Part 2.

The written sample builds the same effects with colons and full stops:

> "Five of them, under one group: IT infrastructure, custom computer hardware,
> media, children's retail, logistics."

## 10. Contractions — the samples DISAGREE; written wins

**This is the one real conflict between the two samples, and it is worth
knowing about rather than averaging away.**

WRITTEN prose is mostly uncontracted: "I am still learning", "I do not know
enough", "It is a record", "That is the whole audience".

SPOKEN is heavily contracted, as all speech is: "we're using", "don't", "it's",
"that's", "you're".

**For prose, follow the written sample: uncontracted by default.** The spoken
contraction rate is a fact about talking, not about voice. A contraction is
available where a line is deliberately conversational — the standing copy has
exactly one, "why I'm not leaving."

## 11. Sentence length — the samples DISAGREE; written wins

WRITTEN runs short and lumpy. Median ~7 words, nothing over 16, fragments used
deliberately ("No schedule.").

SPOKEN runs long and chained, clause after clause joined by "so" and "and" —
normal for thinking aloud, unreadable on a page.

For prose: short, uneven, fragments allowed. Do not import the spoken run-on.

---

## What transfers from speech to prose, and what does not

This distinction is the point of having a spoken sample at all.

**Transfers.** The concreteness (§1). The refusal to give a general answer
(§2). The flat no (§3). The stated limit (§4). Arguing the reader down (§5).
Two options rather than three (§6). The trade-off with its cost (§7). Local
conditions as input (§8).

**Does not transfer — these are voice in speech and noise on a page:**

| Spoken marker | Example from the sample | In prose |
|---|---|---|
| Filler | "you know" (~40 occurrences) | Cut entirely |
| False starts | "So we are— my name is" | Cut |
| Unrepaired self-correction | "We don't really know— we are the hardware guys. We don't really know…" | Say it once |
| Emphatic repetition | "No, no, no, no, no, no" | One "no" |
| Hedge-fillers | "uh", "um", "like", "I mean" | Cut |
| Run-on chaining | clauses joined by "so… and… so…" | Full stops |
| Contractions | "we're", "don't", "it's" | Uncontracted (§10) |

A useful test: if the marker exists because the speaker was buying time to
think, it does not belong in writing, where the thinking already happened.

---

## The four rules the samples still cannot answer

### 12. How a written piece opens — PROVISIONAL — UNVERIFIED

Speech cannot answer this, and I am not going to pretend it can. A call opens
with greetings and an introduction; an essay does not.

What the spoken sample *does* show is how he opens an **explanation** once the
call is underway: with the dependency, not the conclusion — "So it all depends
on the workflow." That is suggestive for section openings, not for a piece.

The written sample's only opening is "I build companies in Abuja." — five words,
no setup. Proposal, unchanged: open on the claim or the problem in one short
sentence. No throat-clearing, no defining the topic before making a point about it.

### 13. Header frequency — PROVISIONAL — UNVERIFIED

Neither sample says anything. This rests only on the corpus measurement: the
current corpus runs a header every **121 words**, which reads as scaffolding.
Proposal: aim for every 300–400 words and let some sections run without one.

### 14. How a written piece ends — PARTIALLY ANSWERED (SPOKEN)

The spoken sample ends every substantive exchange on a **next action**, never on
a summary:

> "I can send you 2 options— how much it costs with 1 GPU and how much it costs
> with 2 GPUs."

> "All right, I'll do that now and send it to you."

That supports the proposal — end on the next step, not a recap — but a call
ending is a handover, and an essay ending is not. Treat it as evidence for the
CTA and the closing line, and still provisional for how an argument closes.

### 15. Prose vs lists — PROVISIONAL — UNVERIFIED

The spoken sample enumerates aloud ("there are 2 ways… One… But the other"),
which says he structures options in small numbered sets. It says nothing about
when a written passage should become a bulleted list.

Proposal, unchanged: specifications and checklists as lists; reasoning as prose.
Do not bullet an argument — a list of claims hides the logic that makes it one.

---

# Part 2 — The AI-tell checklist

Counts across **50 insight articles, 79,009 words** (the two statutory articles
held out). Re-runnable: `scratchpad/tells.mjs`. The em dash budget is enforced
by `scripts/style-conformance.ts` check 9.

| # | Tell | Count | per 10k words |
|---|---|---|---|
| 1 | Tricolon (a, b, and c) | **472** | 59.7 |
| 2 | Semicolon | 156 | 19.7 |
| 3 | Paragraph restates its header | 118 | 14.9 |
| 4 | Em dash | 115 | 14.6 |
| 5 | Banned vocabulary (real hits) | 25 | 3.2 |
| 6 | Hedging | 5 | 0.6 |
| 7 | "It's not X, it's Y" | **0** | 0 |

## 1. Tricolons — 472 instances. The biggest problem.

Both samples avoid three-for-rhythm (§6 above). The corpus does not.

DON'T (from `a-pre-deployment-site-survey-framework…`):

> "The principle is simple: assess once, ship with confidence, and never let a
> truck leave the warehouse for a site nobody has actually seen."

Test: remove one item. If nothing is lost, it was rhythm filler.

## 2. Em dashes — cap 1 per 400 words, PER ARTICLE

The corpus average (0.58) passes while individual articles run to 9.16. The
average is the wrong unit, so the gate checks each file. Six currently fail.

DON'T (paired dashes as rhythm, from `cost-of-setting-up-a-server-room-in-nigeria`):

> "…wrong for your requirement, and — given how the naira has moved against the
> dollar through 2026 — stale within weeks."

## 3. Paragraph restates its header — 118 instances

DON'T (from `aligning-it-strategy-with-business-growth`):

> **H:** What is the most common cause of IT and business strategy falling out of alignment?
> **P:** The most common cause is structural: IT leadership is not included in…

DO: **P:** "IT leadership is not in the room until the decision is made."

## 4. Semicolons — 156 instances

Zero in the written sample. Most in this corpus join two sentences that are
stronger apart.

DON'T: "In the field this is rarely a clean data centre; it is a corner of a branch."
DO: "In the field this is rarely a clean data centre. It is a corner of a branch."

## 5. Banned vocabulary — 25 real hits

Present: **landscape** (11), **leverage** (11), **ensure** (11),
**comprehensive** (2), **robust** (1). Absent entirely: *in today's*, *delve*,
*seamless*, *navigate*, *crucial*, *at the end of the day* — do not go hunting
for these.

**One exception, do not "fix" it:** both hits for *vital* are the statutory term
**"vital interest"**, a lawful basis under the NDPR. That is a citation.

## 6. Hedging — 5 instances

DON'T: "a qualified technology partner **can help ensure** your RFQ is correctly
structured" — two tells in four words.
DO: "a technology partner will structure the RFQ with you." Or cut it.

The replacement for a hedge is usually a stated limit (§4 above), not a softer
verb.

## 7. "It's not X, it's Y" — 0 instances

Does not appear in the corpus. Keep it that way. Plain negation followed by a
reason is different, and is in the voice (§3).

## 8. Structural tells

**A header every 121 words** — 654 headers across 79,009 words.
**Symmetrical paragraphs** — the worst articles sit at CV 0.22–0.25. Real
writing is lumpy; a one-sentence paragraph is allowed.
**Closing paragraphs that summarise** — if the final paragraph restates what was
just read, cut it.

---

## Statutory content — an absolute exception

Where copy quotes a statute or cites a section, **the quotation and citation are
preserved byte-for-byte.** Rewrite the prose around them, never them.

Two articles are excluded from voice work and style-passed by the owner:

- `what-cbns-it-standards-mean-for-branch-network-and-endpoint-hardening`
- `meeting-ndpa-2023-obligations-when-you-outsource-it-to-third-party-processors`

Both now meet the em dash budget on merit, so neither is exempted in the gate.
