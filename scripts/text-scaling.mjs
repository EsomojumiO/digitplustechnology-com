/**
 * scripts/text-scaling.mjs — the reader-enlarged-their-text gate.
 *
 * WCAG 1.4.4 (Resize Text, AA) and 1.4.10 (Reflow, AA) require content to stay
 * usable when text is scaled to 200%, without two-dimensional scrolling. The
 * HIG says the same thing in its own words: "give people the option to enlarge
 * text by at least 200 percent" and "make sure your app's layout adapts to all
 * font sizes."
 *
 * Nothing tested this, and the site failed it. At a 32px root on a 390px
 * viewport, /contact reported scrollWidth 616 against clientWidth 390 — 226px of
 * sideways scroll. Three separate causes stacked up (see docs/DESIGN-AUDIT.md
 * C1); each one was invisible until the one in front of it was removed, which is
 * exactly why this needs to be a gate rather than a one-off fix.
 *
 * Two assertions per route:
 *   A. No horizontal overflow at a 200% root font size.
 *   B. No text pinned to a hard px size. Every ad-hoc `text-[15px]` is a string
 *      the reader cannot enlarge; the ladder in globals.css is rem-based and
 *      scales. A CTA label that stays 15px next to 32px body copy is the failure
 *      this catches.
 *
 * Usage: node scripts/text-scaling.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4310";

const ROUTES = [
  "/",
  "/services",
  "/services/it-procurement",
  "/industries/government",
  "/about",
  "/approach",
  "/locations/abuja",
  "/insights",
  "/insights/what-an-it-sla-should-cover",
  "/reports",
  "/reports/nigeria-enterprise-it-hardware-price-index-q2-2026",
  "/contact",
  "/privacy",
];

/** 200% of the 16px browser default. */
const SCALED_ROOT = 32;
/** Elements smaller than this are icons/rules, not text worth policing. */
const MIN_TEXT_AREA = 24;

const failures = [];
const fail = (route, check, detail) => failures.push({ route, check, detail });

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1100);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find(
      (x) => x.textContent?.trim() === "Decline",
    );
    b?.click();
  });
  await page.waitForTimeout(300);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

for (const route of ROUTES) {
  const res = await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
  if (!res || res.status() !== 200) {
    fail(route, "http", `status ${res?.status()}`);
    continue;
  }
  await settle(page);

  // ---- B. hard px font sizes, measured at the DEFAULT root ----
  const pinned = await page.evaluate((minArea) => {
    const seen = new Map();
    for (const el of document.querySelectorAll("body *")) {
      if (!el.firstChild) continue;
      // direct text only — otherwise every ancestor reports its child's text
      const ownText = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join(" ")
        .trim();
      if (!ownText) continue;
      const r = el.getBoundingClientRect();
      if (r.width * r.height < minArea) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      const px = parseFloat(cs.fontSize);
      seen.set(`${el.tagName.toLowerCase()}|${px}|${ownText.slice(0, 30)}`, {
        tag: el.tagName.toLowerCase(),
        px,
        text: ownText.slice(0, 40),
        cls: (typeof el.className === "string" ? el.className : "").slice(0, 60),
      });
    }
    return [...seen.values()];
  }, MIN_TEXT_AREA);

  // ---- A. re-measure at 200% root ----
  await page.addStyleTag({ content: `html{font-size:${SCALED_ROOT}px !important}` });
  await page.waitForTimeout(600);

  const after = await page.evaluate(
    ({ minArea, keys }) => {
      const out = {};
      for (const el of document.querySelectorAll("body *")) {
        const ownText = [...el.childNodes]
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent.trim())
          .join(" ")
          .trim();
        if (!ownText) continue;
        const r = el.getBoundingClientRect();
        if (r.width * r.height < minArea) continue;
        const cs = getComputedStyle(el);
        const k = `${el.tagName.toLowerCase()}|${ownText.slice(0, 40)}`;
        if (keys.includes(k)) out[k] = parseFloat(cs.fontSize);
      }
      return {
        sizes: out,
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
      };
    },
    {
      minArea: MIN_TEXT_AREA,
      keys: pinned.map((p) => `${p.tag}|${p.text}`),
    },
  );

  if (after.scrollW > after.clientW + 1) {
    fail(
      route,
      "reflow",
      `horizontal scroll at ${SCALED_ROOT}px root: scrollWidth ${after.scrollW} > clientWidth ${after.clientW}`,
    );
  }

  for (const p of pinned) {
    const now = after.sizes[`${p.tag}|${p.text}`];
    // A rem-based size doubles. Anything that moved less than 25% of the way is
    // pinned in px. Small tolerance for clamp() ceilings, which are legitimate.
    if (now === undefined) continue;
    const grew = (now - p.px) / p.px;
    if (grew < 0.25) {
      fail(
        route,
        "pinned-font-size",
        `<${p.tag}> stayed ${p.px}px (now ${now}px) at a ${SCALED_ROOT}px root — "${p.text}" [${p.cls}]`,
      );
    }
  }

  const mark = failures.some((f) => f.route === route) ? "!! " : "OK ";
  console.log(`${mark}${route.padEnd(58)} scrollW=${after.scrollW}/${after.clientW}`);
}

await browser.close();

if (failures.length === 0) {
  console.log(`\ntext-scaling: PASS — ${ROUTES.length} routes usable at 200% text`);
  process.exit(0);
}
console.log(`\ntext-scaling: FAIL — ${failures.length} failure(s)\n`);
for (const f of failures) console.log(`  ${f.route}\n    [${f.check}] ${f.detail}`);
process.exit(1);
