/**
 * fetch-covers.mjs — Source cover images for insight articles from Unsplash.
 *
 *   UNSPLASH_ACCESS_KEY=... node content-engine/fetch-covers.mjs        # only missing covers
 *   UNSPLASH_ACCESS_KEY=... node content-engine/fetch-covers.mjs --all  # re-fetch every article
 *   UNSPLASH_ACCESS_KEY=... node content-engine/fetch-covers.mjs --slug <slug>
 *
 * For each target article it derives a search query from the title (broadening
 * on no-results, then falling back to a per-category concept), downloads the top
 * landscape photo at 1600x900, writes public/images/insights/<slug>.jpg, and
 * records the photographer in public/images/insights/CREDITS.json.
 *
 * Unsplash licence: free for commercial use, no attribution required (we keep
 * CREDITS.json anyway, in case you ever want an image-credits page).
 */

import fs from "node:fs";
import path from "node:path";
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
function queries(fm) {
  const words = String(fm.title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
  const cands = [];
  if (words.length >= 3) cands.push(words.slice(0, 3).join(" "));
  if (words.length >= 2) cands.push(words.slice(0, 2).join(" "));
  if (words.length >= 1) cands.push(words[0]);
  cands.push(CATEGORY_FALLBACK[fm.category] || "technology office");
  return [...new Set(cands)];
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

async function fetchOne(slug, fm, credits) {
  for (const q of queries(fm)) {
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
    credits[slug] = {
      photographer: photo.user.name,
      profile: photo.user.links.html,
      source: photo.links.html,
      query: q,
    };
    return { ok: true, by: photo.user.name, q };
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
  const files = fs.readdirSync(config.insightsDir).filter((f) => f.endsWith(".mdx"));

  const creditsPath = path.join(config.imagesDir, "CREDITS.json");
  const credits = fs.existsSync(creditsPath) ? JSON.parse(fs.readFileSync(creditsPath, "utf8")) : {};

  const targets = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    if (only && slug !== only) continue;
    const exists = fs.existsSync(path.join(config.imagesDir, `${slug}.jpg`));
    if (!all && !only && exists) continue; // default: only missing
    const fm = matter(fs.readFileSync(path.join(config.insightsDir, file), "utf8")).data;
    targets.push({ slug, fm });
  }

  if (targets.length === 0) {
    console.log("No covers to fetch (all present). Use --all to refresh or --slug <slug>.");
    return;
  }

  console.log(`[covers] fetching ${targets.length} cover(s) from Unsplash…`);
  let ok = 0, fail = 0;
  for (const { slug, fm } of targets) {
    try {
      const r = await fetchOne(slug, fm, credits);
      if (r.ok) { ok++; console.log(`  ✓ ${slug}.jpg — ${r.by} | "${r.q}"`); }
      else { fail++; console.log(`  ✗ ${slug} — no results for any query`); }
    } catch (e) {
      fail++;
      console.log(`  ✗ ${slug} — ${e.message}`);
    }
    await sleep(400); // gentle on the demo rate limit (50 req/hour)
  }

  fs.writeFileSync(creditsPath, JSON.stringify(credits, null, 2));
  console.log(`[covers] done. ${ok} fetched, ${fail} failed.`);
}

main().catch((e) => {
  console.error("[covers] failed:", e.message);
  process.exit(1);
});
