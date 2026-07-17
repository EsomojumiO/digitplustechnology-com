import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const BASE = process.argv[2] ?? "http://localhost:4310";
const ROUTES = ["/","/services","/services/it-procurement","/industries","/industries/government","/locations","/locations/abuja","/about","/approach","/ecosystem","/insights","/reports","/contact","/privacy","/terms"];

const browser = await chromium.launch();
let total = 0;

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  // Scroll-reveal wrappers start at opacity 0 and fade in. Scanning before they
  // settle makes axe blend the text toward the canvas and report ~1.0:1 on
  // perfectly good copy — 81 phantom failures on home at a 300ms wait, 0 at
  // 1500ms. Drive every reveal to completion, then wait out the animation,
  // before measuring anything.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find(x => x.textContent?.trim() === "Decline");
    b?.click();
  });
  await page.waitForTimeout(300);

  const stillAnimating = await page.evaluate(() =>
    [...document.querySelectorAll("*")].some(el => {
      const o = parseFloat(getComputedStyle(el).opacity);
      return o > 0 && o < 1 && el.getAnimations?.().some(a => a.playState === "running");
    }),
  );

  const res = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
  total += res.violations.length;
  const mark = res.violations.length === 0 ? "OK " : "!! ";
  console.log(`${mark}${route.padEnd(30)} violations=${res.violations.length}${stillAnimating ? "  (WARN: animations still running — result unreliable)" : ""}`);
  for (const v of res.violations) console.log(`      [${v.impact}] ${v.id} x${v.nodes.length}`);
  await ctx.close();
}

console.log(`\naxe: ${ROUTES.length} templates, ${total} violation(s)`);
await browser.close();
process.exit(total === 0 ? 0 : 1);
