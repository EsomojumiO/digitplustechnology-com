/**
 * config.mjs — Content engine configuration.
 *
 * Central knobs for the Digitplus authority-content engine. Everything that is
 * a policy decision (model, effort, markets, cadence, quality bar) lives here so
 * the agents and CLIs stay declarative.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

export const config = {
  // ---- Model (see docs: Opus 4.8, adaptive thinking, effort) --------------
  model: "claude-opus-4-8",
  /** "low" | "medium" | "high" | "xhigh" | "max". Writing quality wants high. */
  effort: "high",
  /** Generous ceiling — articles are ~1,200–1,800 words (≈3–5k output tokens). */
  maxTokens: 16000,

  // ---- Paths --------------------------------------------------------------
  repoRoot,
  insightsDir: path.join(repoRoot, "content", "insights"),
  imagesDir: path.join(repoRoot, "public", "images", "insights"),
  backlogPath: path.join(__dirname, "topics", "backlog.json"),

  // ---- Lane discipline (NEVER cross — store domain owns product content) --
  storeDomain: "thedigitplus.com",

  // ---- The 7 canonical categories (MUST match src/lib/content/types.ts) ---
  // Frontmatter `category` must be one of these exact labels or the loader
  // silently falls back to "Guides".
  categories: [
    "IT Strategy & Advisory",
    "Infrastructure",
    "Procurement",
    "Cybersecurity",
    "Managed Services",
    "Industry & Policy",
    "Guides",
  ],

  // ---- Markets — Nigeria only ---------------------------------------------
  // Scope narrowed to Nigeria on 2026-08-22. The multi-market list (Ghana,
  // Kenya, South Africa, Egypt, Rwanda, Pan-African) produced drafts whose
  // regulatory claims we could not source: the config seeded body NAMES but no
  // instruments, so the model supplied instrument descriptions of its own
  // ("Bank of Ghana's cyber and information security directive"), which cannot
  // be looked up or checked. Re-adding a market means adding its bodies AND
  // their instruments below, not just the country name.
  //
  // `bodies` replaces the old flat `regulators` string list. Each body carries
  // the instruments it actually issues, cited well enough to pull up. An
  // obligation claim in an article may cite ONLY these; see instrumentPolicy.
  markets: [
    {
      country: "Nigeria",
      weight: 1,
      bodies: [
        {
          acronym: "NDPC",
          name: "Nigeria Data Protection Commission",
          instruments: [
            "Nigeria Data Protection Act 2023 (NDPA 2023) — Act, June 2023",
            "NDPA General Application and Implementation Directive 2025 (NDPA-GAID 2025) — NDPC directive, March 2025",
          ],
        },
        {
          acronym: "CBN",
          name: "Central Bank of Nigeria",
          instruments: [
            "CBN Risk-Based Cybersecurity Framework and Guidelines for Deposit Money Banks and Payment Service Banks — issued 31 May 2024, effective 1 July 2024",
            "CBN Risk-Based Cybersecurity Framework and Guidelines for Other Financial Institutions (2022)",
          ],
        },
        {
          acronym: "NCC",
          name: "Nigerian Communications Commission",
          // No instrument is listed because we have not verified one. The NCC's
          // relevance here is its REGIME, which may be named as a regime; the
          // model must not invent a regulation, circular or guideline for it.
          instruments: [],
          regimes: [
            "Type approval of communications equipment",
            "Spectrum and service licensing",
          ],
        },
        // Bodies with no verified instrument list. They may be named as bodies;
        // with no instruments, no obligation claim may be attributed to them.
        { acronym: "NITDA", name: "National Information Technology Development Agency", instruments: [] },
        { acronym: "FIRS", name: "Federal Inland Revenue Service", instruments: [] },
      ],
    },
  ],

  // ---- Instrument policy (enforced in the agent prompts) -------------------
  // The failure this exists to stop: an article asserting "the CBN cybersecurity
  // framework requires X" with no identifiable document behind it. A claim you
  // cannot trace to an instrument cannot be fact-checked, and reads as
  // authoritative anyway.
  instrumentPolicy: {
    /** Obligation claims may cite ONLY instruments listed under markets[].bodies[]. */
    citedInstrumentsMustBeListed: true,
    /** If the needed instrument is not listed, drop the claim — do not describe one. */
    onMissingInstrument: "omit-claim",
  },

  // ---- Cluster model — each maps UP to a /services or /industries pillar ---
  // Internal links from articles flow authority to these conversion pages.
  clusters: [
    { key: "it-procurement", pillar: "/services/it-procurement", kind: "service", category: "Procurement" },
    { key: "hardware-supply", pillar: "/services/hardware-supply", kind: "service", category: "Procurement" },
    { key: "infrastructure", pillar: "/services/infrastructure-solutions", kind: "service", category: "Infrastructure" },
    { key: "managed-services", pillar: "/services/managed-services", kind: "service", category: "Managed Services" },
    { key: "advisory", pillar: "/services/technology-advisory", kind: "service", category: "IT Strategy & Advisory" },
    { key: "deployment", pillar: "/services/deployment-implementation", kind: "service", category: "Infrastructure" },
    { key: "government", pillar: "/industries/government", kind: "industry", category: "Industry & Policy" },
    { key: "banking", pillar: "/industries/banking-financial-services", kind: "industry", category: "Industry & Policy" },
    { key: "healthcare", pillar: "/industries/healthcare", kind: "industry", category: "Guides" },
    { key: "education", pillar: "/industries/education", kind: "industry", category: "Guides" },
    { key: "oil-gas-energy", pillar: "/industries/oil-gas-energy", kind: "industry", category: "Infrastructure" },
    { key: "cybersecurity", pillar: "/services/managed-services", kind: "theme", category: "Cybersecurity" },
  ],

  // ---- Quality gate -------------------------------------------------------
  /** Articles scoring below this (0–100) are held for revision, never written live-ready. */
  qualityThreshold: 80,
  /** Every generated article ships draft:true — a human flips it to false. */
  forceDraft: true,

  // ---- Author (E-E-A-T) — must exist in src/data/authors.ts --------------
  defaultAuthor: "Digitplus Technology",

  // ---- Concurrency for the synchronous generate path ----------------------
  // Override with CONTENT_ENGINE_CONCURRENCY. The subscription (cli) provider
  // throttles under parallel load — 4 concurrent claude processes can push
  // individual calls past the 240s timeout, so drop to 1-2 for cli batches.
  concurrency: Math.max(1, Number(process.env.CONTENT_ENGINE_CONCURRENCY) || 4),
};

/**
 * The instruments an article is allowed to cite, as prompt-ready lines.
 *
 * Single source of truth for the citation constraint: the agents interpolate
 * this verbatim, so widening what the model may cite means editing the config
 * above, never the prompt text.
 */
export function allowedInstruments(country = "Nigeria") {
  const market = config.markets.find((m) => m.country === country);
  if (!market) return [];
  return market.bodies.flatMap((b) =>
    b.instruments.map((i) => `${b.acronym} (${b.name}): ${i}`),
  );
}

/** Bodies that may be NAMED but carry no citable instrument. */
export function bodiesWithoutInstruments(country = "Nigeria") {
  const market = config.markets.find((m) => m.country === country);
  if (!market) return [];
  return market.bodies
    .filter((b) => b.instruments.length === 0)
    .map((b) => {
      const regimes = b.regimes?.length ? ` — regime may be named: ${b.regimes.join("; ")}` : "";
      return `${b.acronym} (${b.name})${regimes}`;
    });
}

export default config;
