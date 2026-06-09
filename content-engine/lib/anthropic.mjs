/**
 * anthropic.mjs — Model backend for the content engine.
 *
 * Three providers, auto-detected (override with CONTENT_ENGINE_PROVIDER):
 *   "api"  — @anthropic-ai/sdk against the Anthropic API. Used when
 *            ANTHROPIC_API_KEY is set. Full control: adaptive thinking, effort,
 *            structured outputs (output_config.format), explicit prompt caching.
 *   "cli"  — the Claude Code CLI in headless mode (`claude -p`). Runs on your
 *            Pro/Max SUBSCRIPTION — no API key, no per-token bill. Used when no
 *            API key is present. Requires the Claude Code CLI installed + logged
 *            in (`claude` → /login with your subscription). Caching is handled by
 *            Claude Code; structured output is enforced via strict-JSON prompting.
 *   "stub" — deterministic placeholders, no key/CLI/cost. Set
 *            CONTENT_ENGINE_PROVIDER=stub to force it (used for plumbing tests).
 *
 * Shared "constitution" + per-agent role are sent as the system prompt either
 * way, so the agents are identical across providers.
 */

import { spawn } from "node:child_process";
import { config } from "../config.mjs";

let _client = null;

export function hasApiKey() {
  const key = process.env.ANTHROPIC_API_KEY;
  // Guard against an obviously-invalid/placeholder value (e.g. the literal
  // "sk-ant-..." example) hijacking the api path and 401-ing every call.
  // Real keys are `sk-ant-…`, long, and contain no ellipsis placeholder.
  return Boolean(key) && key.startsWith("sk-ant-") && key.length >= 40 && !key.includes("...");
}

/** Resolve the active provider. */
export function provider() {
  const forced = process.env.CONTENT_ENGINE_PROVIDER;
  if (forced) return forced; // "api" | "cli" | "stub"
  if (hasApiKey()) return "api";
  return "cli"; // subscription path by default when no key is set
}

async function getClient() {
  if (_client) return _client;
  const mod = await import("@anthropic-ai/sdk");
  _client = new mod.default({ maxRetries: 4 });
  return _client;
}

export const CONSTITUTION = `You are part of the editorial engine for Digitplus Technology Limited
(digitplustechnology.com), a CAC-registered Nigerian B2B IT solutions company
(Abuja HQ; delivery in Lagos and Port Harcourt; 8+ years; 50+ enterprise,
government, banking, healthcare, and education clients).

MISSION
This website is an AUTHORITY / top-of-funnel content engine for B2B
decision-makers (IT directors, CIOs, procurement leads, operations heads). It
exists to build topical authority and generate qualified leads — never to sell
products.

THE LANE RULE (absolute)
- Write strategy, planning, policy, and how-to guidance for people deciding
  HOW to run IT.
- NEVER write product-buying content (no "best laptop", "HP vs Dell", prices,
  "buy now", model round-ups). That belongs on the separate store property
  ${config.storeDomain} and would cannibalise it. If a topic's natural next
  step is "add to cart", it is out of lane — reframe to the strategy behind it.

AUDIENCE & VOICE
- Audience: senior, busy, technical-enough Nigerian/African enterprise buyers.
- Voice: calm, precise, authoritative, vendor-neutral. No hype, no emoji, no
  "in today's fast-paced world" filler, no AI throat-clearing. Lead with the
  insight. Concrete over generic. British/Nigerian English spelling.
- PUNCTUATION: do NOT use em dashes (the long "—" dash); they read as
  AI-generated. Use commas, full stops, colons, or parentheses instead. En
  dashes are acceptable only for numeric ranges (e.g. 10-20).

AFRICA CONTEXT (what makes this genuinely relevant, not generic)
- Ground every piece in the real operating environment: grid/power instability
  and generator/UPS realities, FX and import dynamics for hardware, local
  regulation and regulators (e.g. Nigeria: NDPA 2023, NDPC, NITDA, CBN, NCC),
  public-sector LPO/procurement norms, multi-site and connectivity constraints.
- Use the specific country and its real regulators named in the brief — do not
  default everything to "Nigeria" if another market is specified, and do not
  invent regulations, statistics, vendors, or quotes. If you would need a figure
  you cannot stand behind, write qualitatively instead.

QUALITY BAR
- Every article must teach something a competent practitioner would still find
  useful. Specific frameworks, checklists, trade-offs, sequenced steps.
- Truthful claims only. No fabricated data, named clients, or case studies.`;

/**
 * Run an agent turn against the active provider.
 * @returns parsed object (when schema given) or trimmed string (prose).
 */
export async function runAgent({ role, user, schema, stub }) {
  const p = provider();
  if (p === "stub") {
    return schema ? stubObject(schema, stub) : (stub ?? "[STUB OUTPUT]");
  }

  const systemText = schema
    ? `${role}\n\n${schemaInstruction(schema)}`
    : role;

  const text = p === "api"
    ? await callApi({ role, systemText, user, schema })
    : await callCli({ systemText, user });

  if (!schema) return text.trim();
  return parseJson(text);
}

/* ───────────────────────────── API provider ───────────────────────────── */

async function callApi({ role, user, schema }) {
  const client = await getClient();
  const req = {
    model: config.model,
    max_tokens: config.maxTokens,
    thinking: { type: "adaptive" },
    output_config: { effort: config.effort },
    system: [
      { type: "text", text: CONSTITUTION },
      { type: "text", text: role, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: user }],
  };
  if (schema) req.output_config.format = { type: "json_schema", schema };

  const res = await client.messages.create(req);
  return res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
}

/* ───────────────────────── CLI (subscription) provider ─────────────────── */

async function callCli({ systemText, user }) {
  const bin = process.env.CLAUDE_CLI || "claude";
  const args = [
    "-p",
    "--output-format", "json",
    "--model", config.model,
    "--append-system-prompt", `${CONSTITUTION}\n\n${systemText}`,
  ];

  const raw = await spawnText(bin, args, user);
  // Headless JSON envelope: { type, result, ... }. Fall back to raw stdout.
  try {
    const env = JSON.parse(raw);
    if (typeof env.result === "string") return env.result;
    if (env.is_error) throw new Error(env.result || "claude CLI reported an error");
  } catch {
    /* not the JSON envelope — use raw */
  }
  return raw;
}

function spawnText(bin, args, input) {
  return new Promise((resolve, reject) => {
    let child;
    // The CLI uses the subscription login; an invalid/placeholder
    // ANTHROPIC_API_KEY in the environment would force it onto the API and
    // 401. Strip it from the child env when it isn't a usable key.
    const childEnv = { ...process.env };
    if (!hasApiKey()) delete childEnv.ANTHROPIC_API_KEY;
    try {
      child = spawn(bin, args, { stdio: ["pipe", "pipe", "pipe"], env: childEnv });
    } catch (e) {
      return reject(cliMissing(bin, e));
    }
    let out = "", err = "";
    // Override with CLAUDE_CLI_TIMEOUT_MS. Long, high-effort articles can exceed
    // the 240s default on the subscription path; raise it for stubborn briefs.
    const timeoutMs = Math.max(60_000, Number(process.env.CLAUDE_CLI_TIMEOUT_MS) || 240_000);
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`claude CLI timed out after ${Math.round(timeoutMs / 1000)}s`));
    }, timeoutMs);

    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e.code === "ENOENT" ? cliMissing(bin, e) : e);
    });
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) return resolve(out);
      reject(new Error(`claude CLI exited ${code}: ${(err || out).slice(0, 300)}`));
    });

    child.stdin.write(input);
    child.stdin.end();
  });
}

function cliMissing(bin, e) {
  return new Error(
    `Claude Code CLI not found ("${bin}"). To use your Pro/Max subscription:\n` +
    `  1) Install the Claude Code CLI (npm i -g @anthropic-ai/claude-code, or see claude.com/code)\n` +
    `  2) Run "claude" once and /login with your subscription account\n` +
    `  3) Ensure it's on PATH, or set CLAUDE_CLI=/full/path/to/claude\n` +
    `Alternatively set ANTHROPIC_API_KEY to use the API. (${e.code || e.message})`,
  );
}

/* ───────────────────────────── helpers ────────────────────────────────── */

function schemaInstruction(schema) {
  return (
    "OUTPUT FORMAT: Respond with ONLY a single JSON object that validates against " +
    "this JSON Schema. No markdown code fences, no prose before or after:\n" +
    JSON.stringify(schema)
  );
}

function parseJson(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error(`Expected JSON from agent, got:\n${text.slice(0, 400)}`);
  }
}

function stubObject(schema, override) {
  if (override) {
    try { return JSON.parse(override); } catch { /* fall through */ }
  }
  return buildFromSchema(schema);
}

function buildFromSchema(s) {
  if (!s || typeof s !== "object") return null;
  switch (s.type) {
    case "object": {
      const out = {};
      for (const [k, v] of Object.entries(s.properties ?? {})) out[k] = buildFromSchema(v);
      return out;
    }
    case "array": return [buildFromSchema(s.items)];
    case "integer":
    case "number": return 0;
    case "boolean": return false;
    default: return s.enum?.[0] ?? "stub";
  }
}

export default { runAgent, hasApiKey, provider, CONSTITUTION };
