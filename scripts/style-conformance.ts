/**
 * scripts/style-conformance.ts — the Apple-light exit gate.
 *
 * Runs against every route's RENDERED output (a real Chromium, real computed
 * styles), not the source. Source greps miss the interesting failures: a class
 * that loses a tailwind-merge conflict, a token that resolves to the wrong
 * value, an inherited colour. All three of those actually happened here.
 *
 * Usage: node --experimental-strip-types scripts/style-conformance.ts [baseUrl]
 * Exits 0 only if every check passes.
 *
 * Checks:
 *   1. No dark-theme token values anywhere in computed styles
 *   2. Exactly one <h1> per route
 *   3. <=1 orange fill per viewport (overlays exempt; <=1 fill per overlay)
 *   4. Every text/background pair >= 4.5:1 (computed, not declared)
 *   5. Section padding from the approved scale
 *   6. Only the winning fonts load
 *   7. No retired classnames
 *   8. Hero headline line budget: <=2 desktop / <=3 mobile
 */
import { chromium, type Page } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4310";

const ROUTES = [
  "/",
  "/services",
  "/services/it-procurement",
  "/industries",
  "/industries/government",
  "/locations",
  "/locations/abuja",
  "/about",
  "/approach",
  "/ecosystem",
  "/insights",
  "/reports",
  "/contact",
  "/privacy",
  "/terms",
];

/** Dark-theme values that must not survive the flip. */
const DARK_TOKENS = [
  "rgb(6, 7, 7)", // --background
  "rgb(11, 13, 12)", // --surface
  "rgb(10, 16, 13)", // --brand
  "rgb(250, 250, 250)", // --text
  "rgb(255, 138, 61)", // --accent (dark orange)
  "rgb(61, 220, 132)", // --accent-green (dark green)
];

/** Classnames retired by the rebuild. Their presence means a stale surface. */
const RETIRED = [
  "cover-dark",
  "grain-overlay",
  "aurora",
  "glow",
  "glow-orange",
  "circuit-pulse",
  "route-enter",
];

const ORANGE = "rgb(173, 69, 39)";
const ALLOWED_PY = [48, 64, 80, 96, 128, 160];

type Failure = { route: string; check: string; detail: string };
const failures: Failure[] = [];
const fail = (route: string, check: string, detail: string) =>
  failures.push({ route, check, detail });

const lum = (r: number, g: number, b: number) => {
  const f = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: number[], b: number[]) => {
  const l1 = lum(a[0], a[1], a[2]);
  const l2 = lum(b[0], b[1], b[2]);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const parse = (s: string): number[] | null => {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(s);
  if (!m) return null;
  if (m[4] !== undefined && Number(m[4]) === 0) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
};

async function dismissOverlays(page: Page) {
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find(
      (x) => x.textContent?.trim() === "Decline",
    );
    b?.click();
  });
  await page.waitForTimeout(250);
}

async function checkRoute(page: Page, route: string) {
  const res = await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
  if (!res || res.status() !== 200) {
    fail(route, "http", `status ${res?.status()}`);
    return;
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await dismissOverlays(page);

  // 2. exactly one h1
  const h1s = await page.locator("h1").count();
  if (h1s !== 1) fail(route, "one-h1", `found ${h1s}`);

  // 6. fonts
  const fonts: string[] = await page.evaluate(() =>
    [...new Set([...document.fonts].map((f) => f.family))].sort(),
  );
  const allowed = new Set(["Inter", "Inter Fallback", "JetBrains Mono", "JetBrains Mono Fallback"]);
  const stray = fonts.filter((f) => !allowed.has(f));
  if (stray.length) fail(route, "fonts", `unexpected: ${stray.join(", ")}`);

  // 1 + 4 + 7: walk the rendered tree once
  const report = await page.evaluate(
    ({ DARK_TOKENS, RETIRED }) => {
      const darkHits: string[] = [];
      const retiredHits: string[] = [];
      const pairs: { fg: string; bg: string; text: string; size: number; weight: number }[] = [];

      /**
       * Effective background = every semi-transparent layer composited down to
       * the first opaque one. Returning the first non-transparent value is
       * wrong: tokens like --brand-subtle are rgba(45 93 73 / 0.08), so a naive
       * walk compares green text against "green at 8%" and reports 1.00:1 —
       * a phantom failure for a chip that actually renders green on a pale tint
       * over white. Composite, don't stop at the first hit.
       */
      const bgOf = (el: Element): string => {
        const layers: number[][] = [];
        let n: Element | null = el;
        while (n) {
          const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(
            getComputedStyle(n).backgroundColor,
          );
          if (m) {
            const a = m[4] === undefined ? 1 : Number(m[4]);
            if (a > 0) {
              layers.push([Number(m[1]), Number(m[2]), Number(m[3]), a]);
              if (a === 1) break; // opaque — nothing below it shows through
            }
          }
          n = n.parentElement;
        }
        // Nothing opaque found: the canvas is white.
        let base = [255, 255, 255];
        // Composite from the bottom layer upward (source-over).
        for (let i = layers.length - 1; i >= 0; i--) {
          const [r, g, b, a] = layers[i];
          base = [
            Math.round(r * a + base[0] * (1 - a)),
            Math.round(g * a + base[1] * (1 - a)),
            Math.round(b * a + base[2] * (1 - a)),
          ];
        }
        return `rgb(${base[0]}, ${base[1]}, ${base[2]})`;
      };

      document.querySelectorAll("*").forEach((el) => {
        const cs = getComputedStyle(el);
        const cls = typeof el.className === "string" ? el.className : "";

        for (const r of RETIRED) {
          if (cls.split(/\s+/).includes(r)) retiredHits.push(`${el.tagName}.${r}`);
        }
        for (const t of DARK_TOKENS) {
          if (cs.backgroundColor === t) darkHits.push(`${el.tagName} bg=${t}`);
          if (cs.color === t) darkHits.push(`${el.tagName} color=${t}`);
        }

        // Only leaf text nodes with visible text
        const own = [...el.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent?.trim(),
        );
        if (!own) return;
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        if (cs.visibility === "hidden" || cs.opacity === "0") return;
        pairs.push({
          fg: cs.color,
          bg: bgOf(el),
          text: (el.textContent ?? "").trim().slice(0, 24),
          size: parseFloat(cs.fontSize),
          weight: Number(cs.fontWeight) || 400,
        });
      });

      const py = [...document.querySelectorAll("section")].map((s) => {
        const cs = getComputedStyle(s);
        return { top: Math.round(parseFloat(cs.paddingTop)), bottom: Math.round(parseFloat(cs.paddingBottom)) };
      });

      const oranges: string[] = [];
      const orangeCtas: string[] = [];
      document.querySelectorAll("*").forEach((el) => {
        if (getComputedStyle(el).backgroundColor !== "rgb(173, 69, 39)") return;
        const r = (el as HTMLElement).getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight || r.width === 0) return;
        const text = (el.textContent ?? "").trim();
        oranges.push(`${el.tagName} "${text.slice(0, 16)}"`);
        // Orange links/buttons are the primary CTAs — capture their labels.
        if (/^(A|BUTTON)$/.test(el.tagName) && text) orangeCtas.push(text);
      });

      // Scrim exception: a dark gradient over a photo is allowed ONLY inside the
      // hero carousel. Anywhere else it's the dark-theme scrim idiom creeping
      // back. Flag any full-cover dark linear-gradient outside the carousel.
      const hero = document.querySelector('[aria-roledescription="carousel"]');
      const scrims: string[] = [];
      document.querySelectorAll("*").forEach((el) => {
        const bg = getComputedStyle(el).backgroundImage;
        // Meaningful DARK alpha (>= 0.1), not the "to-transparent" end which
        // serialises as rgba(0, 0, 0, 0) and would false-positive every fade.
        if (!bg.includes("linear-gradient") || !/rgba\(0, 0, 0, (0\.[1-9]|[1-9])/.test(bg)) return;
        if (hero && hero.contains(el)) return; // hero-only exception
        const r = (el as HTMLElement).getBoundingClientRect();
        if (r.width < 40 || r.height < 40) return; // ignore tiny gradient chips
        scrims.push(`${el.tagName}.${String(el.className).slice(0, 24)}`);
      });

      // CTA labels: the retired "Get a quote" must not reappear, and every
      // primary CTA (a/button with the accent fill or a lg pill) should carry an
      // intent-matched label. We collect all button/link labels for the retired
      // check; the map is enforced in Node against the approved set.
      const ctaLabels: string[] = [];
      document.querySelectorAll("a, button").forEach((el) => {
        const t = (el.textContent ?? "").trim();
        if (t) ctaLabels.push(t);
      });

      return { darkHits, retiredHits, pairs, py, oranges, orangeCtas, scrims, ctaLabels };
    },
    { DARK_TOKENS, RETIRED },
  );

  if (report.darkHits.length)
    fail(route, "dark-tokens", [...new Set(report.darkHits)].join("; "));
  if (report.retiredHits.length)
    fail(route, "retired-classnames", [...new Set(report.retiredHits)].join("; "));

  // 3. one orange fill per viewport
  if (report.oranges.length > 1)
    fail(route, "orange-fills", `${report.oranges.length} in viewport: ${report.oranges.join(", ")}`);

  // 9. scrim-on-light exception — dark gradient over a photo is hero-only
  if (report.scrims.length)
    fail(route, "scrim-outside-hero", [...new Set(report.scrims)].join("; "));

  // 10. CTA labels — the retired "Get a quote" must not reappear anywhere, and
  // every PRIMARY (orange-fill) CTA must carry a label from the canonical map
  // (dynamic "Talk to a …/Reach our …" matched by prefix). Secondary/nav links
  // aren't constrained; the orange fill is the primary intent per viewport.
  const APPROVED_CTA = new Set([
    "Request a proposal",
    "Send your brief",
    "Get this working in your business",
    "Start a conversation",
    "Get a proposal",
    "Subscribe", // newsletter — a legitimate orange action, not a page CTA
  ]);
  const APPROVED_PREFIX = ["Talk to a ", "Reach our "];
  const onMap = (l: string) =>
    APPROVED_CTA.has(l) || APPROVED_PREFIX.some((p) => l.startsWith(p));

  for (const label of report.ctaLabels) {
    if (label.includes("Get a quote"))
      fail(route, "cta-retired", `"Get a quote" is retired — use the intent map`);
  }
  for (const o of report.orangeCtas) {
    if (!onMap(o)) fail(route, "cta-offmap", `orange CTA "${o}" not in the intent map`);
  }

  // 4. contrast
  for (const p of report.pairs) {
    const fg = parse(p.fg);
    const bg = parse(p.bg);
    if (!fg || !bg) continue;
    const r = ratio(fg, bg);
    // WCAG large-text allowance: >=24px, or >=18.66px bold
    const large = p.size >= 24 || (p.size >= 18.66 && p.weight >= 700);
    const bar = large ? 3.0 : 4.5;
    if (r < bar)
      fail(route, "contrast", `${r.toFixed(2)}:1 (need ${bar}) ${p.fg} on ${p.bg} — "${p.text}"`);
  }

  // 5. spacing scale
  for (const s of report.py) {
    for (const v of [s.top, s.bottom]) {
      if (v !== 0 && !ALLOWED_PY.includes(v)) fail(route, "spacing", `section padding ${v}px off-scale`);
    }
  }
}

async function checkHeadline(page: Page, route: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const lines = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    if (!h1) return 0;
    const r = document.createRange();
    r.selectNodeContents(h1);
    const rects = [...r.getClientRects()].filter((x) => x.height > 4);
    return new Set(rects.map((x) => Math.round(x.top))).size;
  });
  const budget = width <= 767 ? 3 : 2;
  if (lines > budget) fail(route, "headline-lines", `${lines} lines at ${width}px (budget ${budget})`);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (const route of ROUTES) {
  await checkRoute(page, route);
  await checkHeadline(page, route, 1440);
  await checkHeadline(page, route, 390);
  await page.setViewportSize({ width: 1440, height: 900 });
}
await browser.close();

if (failures.length === 0) {
  console.log(`style-conformance: PASS — ${ROUTES.length} routes, 0 failures`);
  process.exit(0);
}

const byRoute = new Map<string, Failure[]>();
for (const f of failures) {
  if (!byRoute.has(f.route)) byRoute.set(f.route, []);
  byRoute.get(f.route)!.push(f);
}
console.log(`style-conformance: FAIL — ${failures.length} failure(s)\n`);
for (const [route, fs] of byRoute) {
  console.log(`  ${route}`);
  const seen = new Set<string>();
  for (const f of fs) {
    const line = `    [${f.check}] ${f.detail}`;
    if (seen.has(line)) continue;
    seen.add(line);
    console.log(line);
  }
}
process.exit(1);
