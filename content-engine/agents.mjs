/**
 * agents.mjs — The specialized editorial agents.
 *
 * Each agent is one role with its own instruction (cached alongside the shared
 * constitution) and, where it returns data, a JSON schema for structured output.
 * The pipeline chains them:
 *
 *   strategist → seo → outliner → writer → editor → optimizer → qa
 *
 * Strategist runs once per planning batch; the rest run once per article.
 */

import { runAgent } from "./lib/anthropic.mjs";
import { config } from "./config.mjs";

const clusterKeys = config.clusters.map((c) => c.key);
const countries = config.markets.map((m) => m.country);

const noExtra = (props, required) => ({
  type: "object",
  additionalProperties: false,
  properties: props,
  required: required ?? Object.keys(props),
});

/* ───────────────────────── 1. Topic / keyword strategist ──────────────── */

const STRATEGIST_SCHEMA = noExtra({
  topics: {
    type: "array",
    items: noExtra({
      title: { type: "string" },
      cluster: { type: "string", enum: clusterKeys },
      market: { type: "string", enum: countries },
      category: { type: "string", enum: config.categories },
      angle: { type: "string" },
      primaryKeyword: { type: "string" },
      searchIntent: { type: "string", enum: ["informational", "commercial-investigation"] },
      funnelStage: { type: "string", enum: ["TOFU", "MOFU"] },
    }),
  },
});

export async function strategist({ count, knownTitles = [] }) {
  const clusterLines = config.clusters
    .map((c) => `- ${c.key} → pillar ${c.pillar} (${c.kind}; default category "${c.category}")`)
    .join("\n");
  const marketLines = config.markets
    .map((m) => `- ${m.country}: ${m.regulators.join(", ")}`)
    .join("\n");

  const role = `ROLE: Senior content strategist + SEO lead.
Produce a deduplicated backlog of article briefs that build topical authority and
map to conversion pillars. Each brief becomes one indexable article.

CLUSTERS (map each topic to exactly one; internal links will flow UP to the pillar):
${clusterLines}

MARKETS (use the named country's REAL regulators; Nigeria-weighted but cover Africa):
${marketLines}

RULES
- Strictly in-lane: strategy/planning/policy/how-to. NO product round-ups or buying guides.
- Spread across clusters and markets; avoid clustering everything on Nigeria procurement.
- Distinct angles — no two titles that would compete for the same query (no cannibalisation).
- Titles are specific and decision-maker-grade (e.g. "How to structure an audit-ready
  IT procurement process for a Nigerian MDA"), not generic ("IT procurement tips").
- searchIntent "commercial-investigation" only for service-cluster topics; never transactional.`;

  const user = `Generate ${count} NEW briefs as JSON.
Do NOT duplicate or closely overlap any of these existing titles:
${knownTitles.slice(0, 400).map((t) => `- ${t}`).join("\n") || "- (none yet)"}`;

  const out = await runAgent({ role, user, schema: STRATEGIST_SCHEMA });
  return out.topics ?? [];
}

/* ───────────────────────────── 2. SEO agent ───────────────────────────── */

const SEO_SCHEMA = noExtra({
  primaryKeyword: { type: "string" },
  secondaryKeywords: { type: "array", items: { type: "string" } },
  metaTitle: { type: "string" },
  metaDescription: { type: "string" },
  faqQuestions: { type: "array", items: { type: "string" } },
  coverAlt: { type: "string" },
});

export async function seo(brief) {
  const role = `ROLE: On-page SEO specialist.
For the given brief, return search-optimised metadata for a Nigerian/African B2B reader.
- metaTitle: ~50–60 chars, primary keyword near the front, NO brand suffix (the site appends it).
- metaDescription: ~150–160 chars, benefit-led, reads well as a SERP snippet.
- primaryKeyword: the single head term (localised, e.g. "IT procurement Nigeria").
- secondaryKeywords: 3–6 supporting long-tail terms.
- faqQuestions: 3–4 real questions this audience asks (for a FAQ section / FAQPage schema).
- coverAlt: one concrete sentence describing an apt, on-topic cover photo (a real scene, not abstract).`;

  const user = JSON.stringify(brief);
  return runAgent({ role, user, schema: SEO_SCHEMA });
}

/* ─────────────────────────── 3. Outline architect ─────────────────────── */

const OUTLINE_SCHEMA = noExtra({
  workingTitle: { type: "string" },
  sections: {
    type: "array",
    items: noExtra({
      heading: { type: "string" },
      points: { type: "array", items: { type: "string" } },
    }),
  },
});

export async function outliner(brief, seoData) {
  const role = `ROLE: Outline architect.
Design a logical H2 structure for a 1,200–1,800 word authority article. 4–7 sections.
- Open with the decision/problem, not a dictionary definition.
- Each section: a clear H2 heading + 2–4 bullet points of what it must cover, including
  the specific ${brief.market} context (regulators, power/FX/multi-site realities) where relevant.
- Plan one section that naturally links UP to the cluster pillar.
- Do NOT include the FAQ in sections (added separately). Stay strictly in-lane.`;

  const user = JSON.stringify({ brief, seo: seoData });
  return runAgent({ role, user, schema: OUTLINE_SCHEMA });
}

/* ───────────────────────────── 4. Copywriter ──────────────────────────── */

export async function writer(brief, seoData, outline, pillar) {
  const role = `ROLE: Expert B2B copywriter (Digitplus house voice).
Write the full article body in MARKDOWN (no frontmatter, no H1 — the title is rendered
separately; start sections at "##").
REQUIREMENTS
- 1,200–1,800 words. Calm, authoritative, specific. No filler, no emoji, no preamble.
- Weave in the primary keyword naturally in the first 100 words and in at least one H2.
- Concrete ${brief.market} context throughout (named regulators, power/FX/procurement realities).
- Include 1–2 markdown links UP to the pillar page ${pillar} using natural anchor text,
  plus a place a related-article cross-link could go.
- End with a "## Frequently asked questions" section answering these, each as "### Question"
  then a tight 2–4 sentence answer: ${(seoData.faqQuestions || []).join(" | ")}
- Optionally one ">" pull quote. Truthful only — invent no data, clients, or quotes.
- Close with a forward-looking paragraph inviting the reader to plan/assess or talk to Digitplus
  (advisory framing, never "buy").`;

  const user = JSON.stringify({ brief, seo: seoData, outline });
  return runAgent({
    role,
    user,
    stub: stubBody(brief, seoData, pillar),
  });
}

/* ───────────────────────────── 5. Editor ──────────────────────────────── */

const EDITOR_SCHEMA = noExtra({
  body: { type: "string" },
  laneViolation: { type: "boolean" },
  issues: { type: "array", items: { type: "string" } },
});

export async function editor(brief, body) {
  const role = `ROLE: Managing editor + fact integrity reviewer.
Tighten the draft and enforce standards. Return the REVISED full markdown body plus flags.
- Cut filler and hedging; fix flow, headings, and consistency. Keep it 1,200–1,800 words.
- LANE: if any passage drifts into product selling / buying-guide territory, rewrite it to
  strategy framing and set laneViolation=true with a note.
- INTEGRITY: remove or qualify any statistic, regulation, client, or quote that is not safely
  true; never fabricate. List anything you changed for this reason in issues.
- Preserve the internal links and the FAQ section.`;

  const user = JSON.stringify({ brief, body });
  return runAgent({
    role,
    user,
    schema: EDITOR_SCHEMA,
    stub: JSON.stringify({ body, laneViolation: false, issues: [] }),
  });
}

/* ───────────────────────────── 6. SEO optimizer ───────────────────────── */

const OPTIMIZER_SCHEMA = noExtra({
  body: { type: "string" },
  excerpt: { type: "string" },
  tags: { type: "array", items: { type: "string" } },
});

export async function optimizer(brief, seoData, body, pillar) {
  const role = `ROLE: Final on-page SEO pass.
Return the finalised markdown body plus an excerpt and tags.
- Ensure: primary keyword in the first 100 words AND in ≥1 H2; at least one link UP to
  ${pillar}; semantic, scannable headings. Make minimal edits to achieve this — do not bloat.
- excerpt: 1–2 plain sentences (≤ 220 chars) for cards and meta fallback.
- tags: 3–6 lowercase topic tags (not URLs).`;

  const user = JSON.stringify({ brief, seo: seoData, body });
  return runAgent({
    role,
    user,
    schema: OPTIMIZER_SCHEMA,
    stub: JSON.stringify({
      body,
      excerpt: `${brief.angle} — practical guidance for ${brief.market} decision-makers.`,
      tags: [brief.cluster, brief.market.toLowerCase(), "strategy"],
    }),
  });
}

/* ───────────────────────────── 7. QA gate ─────────────────────────────── */

const QA_SCHEMA = noExtra({
  score: { type: "integer" },
  laneViolation: { type: "boolean" },
  issues: { type: "array", items: { type: "string" } },
});

export async function qa(article) {
  const role = `ROLE: Quality gate. Score the finished article 0–100 for an enterprise reader.
Weigh: genuine usefulness/depth (40), ${article.market || "market"} specificity & correctness (25),
voice & clarity (15), on-page SEO completeness incl. internal links + FAQ (15), lane discipline (5).
Set laneViolation=true if it sells products or strays toward buying-guide content.
List concrete issues. Be a tough but fair editor — generic filler scores below 70.`;

  const user = JSON.stringify({
    title: article.title,
    market: article.market,
    category: article.category,
    body: article.body,
  });

  return runAgent({
    role,
    user,
    schema: QA_SCHEMA,
    stub: JSON.stringify({ score: 88, laneViolation: false, issues: ["stub QA — no model"] }),
  });
}

/* ───────────────────────── stub body (no-key mode) ────────────────────── */

function stubBody(brief, seoData, pillar) {
  const kw = seoData.primaryKeyword || brief.primaryKeyword || brief.title;
  return `> STUB DRAFT — generated without an API key. Set ANTHROPIC_API_KEY for real output.

This placeholder stands in for a 1,200–1,800 word authority article on **${kw}** for
${brief.market} decision-makers. It exists only to verify the pipeline, frontmatter, and
rendering. The real engine produces specific, in-lane guidance grounded in ${brief.market}
regulators and operating realities, with internal links up to [the relevant service](${pillar}).

## Why this matters in ${brief.market}

Placeholder section.

## Frequently asked questions

### ${(seoData.faqQuestions || ["Example question?"])[0]}

Placeholder answer.`;
}

export default { strategist, seo, outliner, writer, editor, optimizer, qa };
