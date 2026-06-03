# Content Engine — Digitplus authority articles at scale

A pipeline of specialized Claude agents that produces **in-lane, Nigeria/Africa-grounded
authority articles** as MDX in `content/insights/`, ready for human review.

> **Read this first — the 1,000-article reality.** Publishing ~1,000 AI articles in a
> short window is the fastest way to trigger Google's *scaled content abuse* penalty and
> de-index the site. This engine is built to *produce* 1,000+ excellent articles **over
> time, in quality-gated clusters, on a steady cadence**, every one `draft:true` until a
> human approves it. Generate in batches, review, publish a cluster, repeat. Do **not**
> bulk-publish. See `docs/CONTENT-STRATEGY.md` for the cadence model.

## The pipeline (specialized agents)

```
            ┌─ plan (once per batch) ─┐
  strategist │  topic + keyword map    │ → topics/backlog.json
            └─────────────────────────┘
  per article:  seo → outliner → writer(copywriter) → editor → optimizer → QA gate
                 │      │           │                   │          │          │
              keywords  H2 plan   1,200–1,800w prose  fact/lane  on-page   score 0–100
                                                       check     SEO       (held if <80)
```

Each agent is a role-specific prompt sharing one cached **constitution** (brand voice, the
lane rule, Africa context, quality bar) — see `lib/anthropic.mjs`. Articles below the
quality threshold or that trip the lane check are **held, not written**.

## Setup — three providers, auto-detected

The engine picks a backend automatically (override with `CONTENT_ENGINE_PROVIDER`):

| Provider | When | Cost | Notes |
|---|---|---|---|
| **`cli`** (default when no API key) | Runs on your **Claude Pro/Max subscription** via the Claude Code CLI in headless mode (`claude -p`) | Flat (subscription) | Subject to subscription rate limits — best for **small phased batches**, not fast bulk. Structured output via strict-JSON prompting. |
| **`api`** | When `ANTHROPIC_API_KEY` is set | Pay-per-token (~$0.10–0.30/article with caching) | Full control: effort, prompt caching, schema-enforced output. Best for volume. |
| **`stub`** | `CONTENT_ENGINE_PROVIDER=stub` | Free | Deterministic placeholders for plumbing tests — no key/CLI needed. |

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"   # this project's Node
npm install                                                  # installs @anthropic-ai/sdk (used by the api provider)
```

### Using your Claude subscription (default)
1. Install the Claude Code CLI: `npm i -g @anthropic-ai/claude-code` (or see claude.com/code).
2. Run `claude` once and **/login with your Pro/Max account**.
3. Make sure `claude` is on your PATH (or set `CLAUDE_CLI=/full/path/to/claude`).

That's it — with no `ANTHROPIC_API_KEY` set, the engine uses the subscription automatically.
> ⚠️ Subscription usage has 5-hour/weekly caps built for interactive use. Generate in **small
> clusters** (a handful at a time) — which is exactly the safe publishing cadence anyway. For a
> fast 1,000-article push, set `ANTHROPIC_API_KEY` to switch to the pay-per-token API instead.

### Using an API key instead
```bash
export ANTHROPIC_API_KEY=sk-ant-...   # auto-switches the engine to the api provider
```

## Usage

```bash
# 1) Build the backlog (re-run to grow toward 1,000; each run dedupes against prior titles)
npm run content:plan -- --count 50

# 2) Preview one article without writing anything
npm run content:generate -- --count 1 --dry-run

# 3) Generate a quality-gated batch (writes draft:true MDX, records outcomes on the backlog)
npm run content:generate -- --count 4
npm run content:generate -- --count 8 --cluster banking --market Kenya

# 4) Fetch cover images for any articles missing one (Unsplash, free commercial
#    licence). Needs UNSPLASH_ACCESS_KEY (free app at unsplash.com/developers).
UNSPLASH_ACCESS_KEY=... npm run content:covers           # only missing covers
UNSPLASH_ACCESS_KEY=... npm run content:covers -- --all  # refresh every cover

# 5) Review the drafts, then flip draft:false a cluster at a time.
```

`--count` batch size · `--dry-run` preview only · `--cluster <key>` / `--market <country>`
filter the backlog (keys/countries are defined in `config.mjs`).

## Files

| File | Role |
|---|---|
| `config.mjs` | Model, effort, the 7 canonical categories, markets+regulators, clusters→pillars, quality bar |
| `lib/anthropic.mjs` | Opus 4.8 client: adaptive thinking, effort, **prompt-cached** constitution+role, structured outputs, stub mode |
| `lib/content.mjs` | Slugify, MDX/frontmatter render (matches `src/lib/content/types.ts`), dedup guard, IO |
| `agents.mjs` | The 7 specialized agents |
| `pipeline.mjs` | One brief → finished, QA-gated article |
| `plan.mjs` / `generate.mjs` | CLIs |
| `topics/backlog.json` | The generated topic plan + per-brief status (pending/written/held) |

## Cost & safety

- **Caching:** the constitution + each role instruction are cached, so across a batch only
  the small per-article turn is full price. Check `usage.cache_read_input_tokens` is non-zero.
- **Lane discipline:** the constitution forbids product/buying content (that belongs on
  `thedigitplus.com`); the editor and QA agents both enforce it.
- **Truthfulness:** agents are instructed never to fabricate stats, regulations, clients, or
  quotes — but **human review is still required** before publishing. Everything ships `draft:true`.
- **Scale economy:** for a large run, the Anthropic **Message Batches API** halves cost; the
  synchronous path here is fine for the cluster-sized batches the cadence calls for.
