/**
 * fetch-covers.mjs — Source cover images for insight articles from Unsplash.
 *
 *   UNSPLASH_ACCESS_KEY=... node content-engine/fetch-covers.mjs        # only missing covers
 *   UNSPLASH_ACCESS_KEY=... node content-engine/fetch-covers.mjs --all  # re-fetch every article
 *   UNSPLASH_ACCESS_KEY=... node content-engine/fetch-covers.mjs --slug <slug>
 *   UNSPLASH_ACCESS_KEY=... node content-engine/fetch-covers.mjs --slug <slug> --query "server room cabling"
 *
 * For each target article it derives a search query from the title (broadening
 * on no-results, then falling back to a per-category concept), downloads the top
 * landscape photo at 1600x900, writes public/images/insights/<slug>.jpg, writes
 * the article's `coverAlt` frontmatter, and records the photographer in
 * public/images/insights/CREDITS.json.
 *
 * coverAlt IS WRITTEN BY THIS SCRIPT, in the same step as the image, and is
 * derived from the photo's OWN metadata. Hand-written alt text cannot survive a
 * re-fetch, and that is the point: previously the script swapped the image and
 * left the alt describing whatever the author had once imagined, so the two
 * drifted apart silently and nothing in the build noticed. Alt derived from the
 * photo can be thin, but it cannot describe a different picture.
 *
 * If the photo carries no usable description, coverAlt is written EMPTY rather
 * than left at its previous value. A blank alt is a visible defect; a stale one
 * that reads plausibly is not.
 *
 * --query overrides the derived query and is tried FIRST, with the derived
 * candidates still behind it as fallback. It exists because the derived query
 * comes from the title alone, which cannot express the imagery policy: covers
 * should read as workplace/infrastructure, and must avoid recognisable people
 * and generic Western office interiors. Steering the search is the only way to
 * hold that line without hand-picking every file. Applies to the current run
 * only — nothing is persisted except the chosen query in CREDITS.json.
 *
 * Unsplash licence: free for commercial use, no attribution required (we keep
 * CREDITS.json anyway, in case you ever want an image-credits page).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { config } from "./config.mjs";

const KEY = process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_KEY;
const flag = (n) => process.argv.includes(`--${n}`);
const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i !== -1 ? process.argv[i + 1] : null;
};

const STOP = new Set([
  "the", "for", "and", "with", "your", "how", "what", "are", "you", "when",
  "without", "into", "across", "from", "that", "this", "not", "but", "a", "an",
  "to", "of", "in", "on", "is", "it", "as", "be", "by", "or", "run", "build",
  "building", "planning", "plan", "guide", "framework", "process", "review",
]);

const CATEGORY_FALLBACK = {
  "Procurement": "procurement office documents",
  "Infrastructure": "server room data center",
  "Cybersecurity": "cybersecurity laptop security",
  "Managed Services": "network operations monitoring screens",
  "IT Strategy & Advisory": "business strategy meeting boardroom",
  "Industry & Policy": "modern corporate office building",
  "Guides": "technology office team",
};

/** Ordered candidate queries, broadening, then a category concept fallback. */
function queries(fm, override) {
  const words = String(fm.title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
  const cands = [];
  if (override) cands.push(override);
  if (words.length >= 3) cands.push(words.slice(0, 3).join(" "));
  if (words.length >= 2) cands.push(words.slice(0, 2).join(" "));
  if (words.length >= 1) cands.push(words[0]);
  cands.push(CATEGORY_FALLBACK[fm.category] || "technology office");
  return [...new Set(cands)];
}

/* ----------------------------- coverAlt writing ---------------------------- */

/** Alt text is prose, not a caption slot — keep it to roughly one breath. */
const ALT_MAX = 160;

/**
 * Alt text from the photo's own metadata.
 *
 * `alt_description` first: it is Unsplash's accessibility field and is a
 * description of what is visible, which is exactly what alt text must be.
 * `description` is the photographer's caption — sometimes richer ("Empty
 * hospital hallway. Gleaming floors."), sometimes a title that describes
 * nothing ("The Files") — so it is the fallback, not the default.
 *
 * Neither field can describe a different image, which is the guarantee we want.
 * Flip the order here if you would rather have the caption's richness and
 * accept that it is occasionally useless.
 */
export function pickAlt(photo) {
  return cleanAlt(photo?.alt_description || photo?.description || "");
}

/** Normalise to a single tidy sentence; "" if there is nothing usable. */
export function cleanAlt(raw) {
  let t = String(raw ?? "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (t.length > ALT_MAX) {
    const cut = t.slice(0, ALT_MAX);
    const sp = cut.lastIndexOf(" ");
    t = (sp > 40 ? cut.slice(0, sp) : cut).replace(/[,;:.]$/, "") + "\u2026";
  }
  return t;
}

/** A double-quoted YAML scalar. */
function yamlDq(v) {
  return `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * Set `coverAlt` inside the frontmatter block ONLY, by line surgery.
 *
 * Deliberately not gray-matter's stringify: that re-serialises the whole block
 * through js-yaml and would reflow every other field — quote styles, the
 * block-style `tags:` lists, key order — turning a one-field update into a
 * whole-file diff on hand-authored MDX. Returns the new source, or the original
 * unchanged if the value already matches.
 */
export function setCoverAlt(source, alt) {
  const m = /^(---\r?\n)([\s\S]*?)(\r?\n---)/.exec(source);
  if (!m) return source; // no frontmatter — leave it alone
  const [, open, block] = m;
  const line = `coverAlt: ${yamlDq(alt)}`;

  let next;
  if (/^coverAlt:.*$/m.test(block)) next = block.replace(/^coverAlt:.*$/m, line);
  else if (/^cover:.*$/m.test(block)) next = block.replace(/^(cover:.*)$/m, `$1\n${line}`);
  else next = `${block}\n${line}`;

  if (next === block) return source;
  const start = m.index + open.length;
  return source.slice(0, start) + next + source.slice(start + block.length);
}

/** Write coverAlt into an article file. Returns true if the file changed. */
function writeCoverAlt(file, alt) {
  const before = fs.readFileSync(file, "utf8");
  const after = setCoverAlt(before, alt);
  if (after === before) return false;
  fs.writeFileSync(file, after);
  return true;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** fetch with retries — transient connect timeouts / 429s are common. */
async function fetchRetry(url, opts = {}, tries = 4) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, opts);
      if (r.status === 429 || r.status >= 500) { last = new Error(`http ${r.status}`); }
      else return r;
    } catch (e) {
      last = e;
    }
    await sleep(1000 * (i + 1));
  }
  throw last;
}

async function fetchOne(slug, fm, credits, override, file) {
  for (const q of queries(fm, override)) {
    const api = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&orientation=landscape&per_page=1&content_filter=high`;
    const res = await fetchRetry(api, { headers: { Authorization: `Client-ID ${KEY}`, "Accept-Version": "v1" } });
    if (!res.ok) throw new Error(`search ${res.status}`);
    const data = await res.json();
    const photo = data.results?.[0];
    if (!photo) { await sleep(300); continue; }

    const imgUrl = `${photo.urls.raw}&w=1600&h=900&fit=crop&crop=entropy&q=80&fm=jpg`;
    const img = await fetchRetry(imgUrl);
    if (!img.ok) throw new Error(`download ${img.status}`);
    fs.writeFileSync(path.join(config.imagesDir, `${slug}.jpg`), Buffer.from(await img.arrayBuffer()));

    // Same step as the image, so the two cannot get out of sync. An empty alt
    // is written deliberately when the photo has no description.
    const alt = pickAlt(photo);
    writeCoverAlt(file, alt);

    // Photographer credit stays here in CREDITS.json — it does NOT belong in
    // alt text, which describes the picture to someone who cannot see it.
    credits[slug] = {
      photographer: photo.user.name,
      profile: photo.user.links.html,
      source: photo.links.html,
      query: q,
    };
    return { ok: true, by: photo.user.name, q, alt };
  }
  return { ok: false };
}

async function main() {
  if (!KEY) {
    console.error("Set UNSPLASH_ACCESS_KEY (create a free app at unsplash.com/developers).");
    process.exit(1);
  }
  fs.mkdirSync(config.imagesDir, { recursive: true });

  const only = arg("slug");
  const all = flag("all");
  const override = arg("query");
  if (override && !only) {
    console.error("--query only makes sense with --slug (it steers one article).");
    process.exit(1);
  }
  const files = fs.readdirSync(config.insightsDir).filter((f) => f.endsWith(".mdx"));

  const creditsPath = path.join(config.imagesDir, "CREDITS.json");
  const credits = fs.existsSync(creditsPath) ? JSON.parse(fs.readFileSync(creditsPath, "utf8")) : {};

  const targets = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    if (only && slug !== only) continue;
    const exists = fs.existsSync(path.join(config.imagesDir, `${slug}.jpg`));
    if (!all && !only && exists) continue; // default: only missing
    const abs = path.join(config.insightsDir, file);
    const fm = matter(fs.readFileSync(abs, "utf8")).data;
    targets.push({ slug, fm, file: abs });
  }

  if (targets.length === 0) {
    console.log("No covers to fetch (all present). Use --all to refresh or --slug <slug>.");
    return;
  }

  console.log(`[covers] fetching ${targets.length} cover(s) from Unsplash…`);
  let ok = 0, fail = 0;
  const noAlt = [];
  for (const { slug, fm, file } of targets) {
    try {
      const r = await fetchOne(slug, fm, credits, override, file);
      if (r.ok) {
        ok++;
        if (!r.alt) noAlt.push(slug);
        const altNote = r.alt ? `alt: "${r.alt}"` : "alt: EMPTY (photo has no description)";
        console.log(`  ✓ ${slug}.jpg — ${r.by} | "${r.q}" | ${altNote}`);
      }
      else { fail++; console.log(`  ✗ ${slug} — no results for any query`); }
    } catch (e) {
      fail++;
      console.log(`  ✗ ${slug} — ${e.message}`);
    }
    await sleep(400); // gentle on the demo rate limit (50 req/hour)
  }

  fs.writeFileSync(creditsPath, JSON.stringify(credits, null, 2));
  console.log(`[covers] done. ${ok} fetched, ${fail} failed.`);
  if (noAlt.length) {
    console.log(
      `[covers] ${noAlt.length} cover(s) have an EMPTY coverAlt — write one by hand:\n` +
        noAlt.map((s) => `  - ${s}`).join("\n"),
    );
  }
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  main().catch((e) => {
    console.error("[covers] failed:", e.message);
    process.exit(1);
  });
}
