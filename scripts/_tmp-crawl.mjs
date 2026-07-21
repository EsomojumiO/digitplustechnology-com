/* Full-site launch crawl: status, main content, JSON-LD, console errors,
 * meta uniqueness/length, image alts, internal links, theme-color. */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:4310";
const PROD = "https://digitplustechnology.com";

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const routes = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)]
  .map((m) => m[1].replace(PROD, ""))
  .map((r) => (r === "" ? "/" : r));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

const rows = [];
for (const route of routes) {
  const page = await ctx.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  const resp = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const d = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const main = q("main");
    const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => s.textContent,
    );
    return {
      title: document.title,
      desc: q('meta[name="description"]')?.content ?? null,
      canonical: q('link[rel="canonical"]')?.href ?? null,
      robots: q('meta[name="robots"]')?.content ?? null,
      themeColor: [...document.querySelectorAll('meta[name="theme-color"]')].map((m) => ({
        c: m.content,
        media: m.media || null,
      })),
      colorScheme: q('meta[name="color-scheme"]')?.content ?? null,
      ogImage: q('meta[property="og:image"]')?.content ?? null,
      twImage: q('meta[name="twitter:image"]')?.content ?? null,
      ogTitle: q('meta[property="og:title"]')?.content ?? null,
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
      mainText: (main?.innerText ?? "").trim().length,
      hasMain: !!main,
      jsonld,
      imgs: [...document.querySelectorAll("img")].map((i) => ({
        src: i.getAttribute("src")?.slice(0, 120),
        alt: i.getAttribute("alt"),
        hasAlt: i.hasAttribute("alt"),
      })),
      links: [...document.querySelectorAll("a[href]")]
        .map((a) => ({
          href: a.getAttribute("href"),
          text: (a.innerText || a.getAttribute("aria-label") || "").trim(),
        }))
        .filter((l) => l.href.startsWith("/")),
    };
  });

  // parse json-ld
  const ldTypes = [];
  const ldErrors = [];
  for (const raw of d.jsonld) {
    try {
      const p = JSON.parse(raw);
      for (const node of Array.isArray(p) ? p : [p]) {
        const g = node["@graph"] ? node["@graph"] : [node];
        for (const n of g) ldTypes.push(n["@type"]);
        if (!node["@context"]) ldErrors.push("missing @context");
      }
    } catch (e) {
      ldErrors.push("INVALID JSON: " + String(e).slice(0, 80));
    }
  }

  rows.push({
    route,
    status: resp.status(),
    ...d,
    ldTypes: ldTypes.flat(),
    ldErrors,
    consoleErrors,
    pageErrors,
  });
  await page.close();
}

await browser.close();
fs.writeFileSync(process.argv[3] ?? "/tmp/crawl.json", JSON.stringify(rows, null, 2));
console.log(`crawled ${rows.length} routes`);
