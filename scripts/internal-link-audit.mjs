/**
 * internal-link-audit.mjs — SEO internal-linking gate.
 *
 * Fails the build if any indexable page is:
 *   1. an ORPHAN   — zero inbound internal links from any other page, or
 *   2. TOO DEEP    — more than 3 clicks from the home page, or
 *   3. linked with a NON-DESCRIPTIVE anchor ("click here", "read more", …).
 *
 * The node universe is the sitemap (the set of indexable URLs). Edges are built
 * by actually crawling: we load every sitemap route AND follow pagination
 * (?page=N) links, so articles that only appear on page 2+ of a listing get
 * their real inbound edges instead of being mis-flagged as orphans.
 *
 * Usage: node scripts/internal-link-audit.mjs [http://localhost:4310]
 * Exit 0 = clean, 1 = violations (wired into the gate suite).
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4310";
const MAX_DEPTH = 3;

// Anchor text that tells a crawler (and a user) nothing about the destination.
const GENERIC_ANCHORS = new Set([
  "click here", "here", "read more", "more", "read", "link", "this",
  "learn more", "continue", "continue reading", "details", "see more", "go",
]);

const origin = new URL(BASE).origin;

/** Strip origin, query and hash → canonical node path. "/" stays "/". */
function toPath(href) {
  try {
    const u = new URL(href, BASE);
    if (u.origin !== origin) return null; // external
    let p = u.pathname.replace(/\/+$/, "");
    return p === "" ? "/" : p;
  } catch {
    return null;
  }
}

/** Full same-origin URL incl. query (for crawling pagination), hash dropped. */
function toCrawlUrl(href) {
  try {
    const u = new URL(href, BASE);
    if (u.origin !== origin) return null;
    u.hash = "";
    return u.toString();
  } catch {
    return null;
  }
}

// 1. Seed the node universe from the sitemap. The sitemap emits CANONICAL
// (production-origin) URLs, so match on pathname only — never on origin, or
// every node is filtered out when auditing against localhost.
function sitemapPath(loc) {
  try {
    let p = new URL(loc).pathname.replace(/\/+$/, "");
    return p === "" ? "/" : p;
  } catch {
    return null;
  }
}
const sitemapXml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const nodes = new Set(
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => sitemapPath(m[1]))
    .filter(Boolean),
);
console.log(`internal-link-audit: ${nodes.size} indexable URLs in sitemap`);

const browser = await chromium.launch();
const page = await browser.newContext({ viewport: { width: 1440, height: 900 } }).then((c) => c.newPage());

const inbound = new Map([...nodes].map((n) => [n, new Set()])); // node → set of linking nodes
const adjacency = new Map([...nodes].map((n) => [n, new Set()])); // node → set of linked nodes
const genericHits = [];

// 2. Crawl every sitemap route + any discovered pagination variant.
const toFetch = [...nodes].map((p) => (p === "/" ? BASE : `${BASE}${p}`));
const fetched = new Set();
const PAGINATION_CAP = 60;
let paginationFetched = 0;

while (toFetch.length) {
  const url = toFetch.shift();
  if (fetched.has(url)) continue;
  fetched.add(url);

  const fromPath = toPath(url);
  if (!fromPath) continue;

  let anchors;
  try {
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    anchors = await page.$$eval("a[href]", (els) =>
      els.map((a) => ({
        href: a.getAttribute("href") || "",
        text: (a.textContent || "").replace(/\s+/g, " ").trim(),
        aria: a.getAttribute("aria-label") || "",
        title: a.getAttribute("title") || "",
        imgAlt: a.querySelector("img")?.getAttribute("alt") || "",
      })),
    );
  } catch (e) {
    console.log(`  WARN could not load ${url}: ${e.message}`);
    continue;
  }

  for (const a of anchors) {
    if (!a.href || a.href.startsWith("#")) continue;
    const target = toPath(a.href);
    if (!target) continue; // external / mailto / tel

    // Edge (dedupe self-loops).
    if (nodes.has(target) && target !== fromPath) {
      inbound.get(target).add(fromPath);
      adjacency.get(fromPath)?.add(target);
    }

    // Descriptive-anchor check — accessible name from text/aria/title/img alt.
    const name = (a.text || a.aria || a.title || a.imgAlt || "").toLowerCase().trim();
    if (name === "" || GENERIC_ANCHORS.has(name)) {
      genericHits.push({ on: fromPath, href: target ?? a.href, name: name || "(empty)" });
    }

    // Follow pagination so page 2+ listings contribute their edges.
    if (/[?&]page=/.test(a.href) && paginationFetched < PAGINATION_CAP) {
      const crawl = toCrawlUrl(a.href);
      if (crawl && !fetched.has(crawl)) {
        toFetch.push(crawl);
        paginationFetched++;
      }
    }
  }
}
await browser.close();

// 3a. Depth (BFS from "/").
const depth = new Map([["/", 0]]);
const queue = ["/"];
while (queue.length) {
  const cur = queue.shift();
  const d = depth.get(cur);
  for (const next of adjacency.get(cur) ?? []) {
    if (!depth.has(next)) {
      depth.set(next, d + 1);
      queue.push(next);
    }
  }
}

// 3b. Evaluate.
const orphans = [];
const tooDeep = [];
const unreachable = [];
for (const n of nodes) {
  if (n === "/") continue;
  if (inbound.get(n).size === 0) { orphans.push(n); continue; }
  const d = depth.get(n);
  if (d === undefined) unreachable.push(n);
  else if (d > MAX_DEPTH) tooDeep.push({ n, d });
}

// Dedupe generic-anchor hits by (on,href,name).
const seen = new Set();
const generics = genericHits.filter((g) => {
  const k = `${g.on}|${g.href}|${g.name}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

let failed = false;
function report(title, arr, fmt) {
  if (!arr.length) return;
  failed = true;
  console.log(`\n✗ ${title} (${arr.length}):`);
  for (const x of arr.slice(0, 40)) console.log(`    ${fmt(x)}`);
  if (arr.length > 40) console.log(`    …and ${arr.length - 40} more`);
}

report("ORPHANS — no inbound internal link", orphans, (n) => n);
report("UNREACHABLE from home", unreachable, (n) => n);
report(`TOO DEEP — > ${MAX_DEPTH} clicks from home`, tooDeep, (x) => `${x.n} (depth ${x.d})`);
report("NON-DESCRIPTIVE anchors", generics, (g) => `on ${g.on} → ${g.href}  [text: "${g.name}"]`);

if (failed) {
  console.log("\ninternal-link-audit: FAIL");
  process.exit(1);
}
console.log(
  `internal-link-audit: PASS — 0 orphans, all ≤${MAX_DEPTH} clicks from home, all anchors descriptive`,
);
