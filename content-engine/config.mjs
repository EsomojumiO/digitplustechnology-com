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

  // ---- Markets — Nigeria-first, then broader Africa, with real regulators -
  // The strategist weaves the right regulator/context per market so nothing
  // reads like generic global filler.
  markets: [
    { country: "Nigeria", weight: 0.5, regulators: ["NDPA 2023", "NDPC", "NITDA", "CBN", "NCC", "FIRS"] },
    { country: "Ghana", weight: 0.12, regulators: ["Data Protection Act 2012", "Data Protection Commission", "Bank of Ghana", "NCA"] },
    { country: "Kenya", weight: 0.12, regulators: ["Data Protection Act 2019", "ODPC", "Central Bank of Kenya", "Communications Authority"] },
    { country: "South Africa", weight: 0.1, regulators: ["POPIA", "Information Regulator", "SARB", "ICASA"] },
    { country: "Egypt", weight: 0.06, regulators: ["PDPL 2020", "Central Bank of Egypt", "NTRA"] },
    { country: "Rwanda", weight: 0.05, regulators: ["Law N° 058/2021 on data protection", "NCSA", "BNR"] },
    { country: "Pan-African", weight: 0.05, regulators: ["Malabo Convention", "Smart Africa", "AfCFTA digital protocol"] },
  ],

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
  concurrency: 4,
};

export default config;
