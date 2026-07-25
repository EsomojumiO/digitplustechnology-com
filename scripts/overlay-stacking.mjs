/**
 * overlay-stacking.mjs — the overlay/stacking gate.
 *
 * WHAT IT PROTECTS
 * A client reproduced this on a phone: opening the mobile nav on the home page
 * showed the hero carousel instead of the menu. The cause was NOT a z-index
 * number. The header carries `backdrop-blur-xl`, and a non-none
 * `backdrop-filter` — like `filter`, `transform` and `perspective` — makes an
 * element the CONTAINING BLOCK for its `position: fixed` descendants. The menu
 * lived inside the header, so its `fixed inset-0` resolved against the header's
 * 390x48 box instead of the 390x844 viewport. The panel collapsed to a 48px
 * strip and its own `overflow-hidden` clipped the nav away.
 *
 * A second, independent defect sat underneath it: the hero <section> was
 * `relative` at `z-index: auto`, which is NOT a stacking context, so the hero's
 * internal scrim/text/progress-bar layers escaped into the ROOT stacking
 * context and competed with site chrome directly.
 *
 * Both failures are invisible to a plain "did the page render" check, so this
 * gate asserts the things that actually broke:
 *
 *   1. GEOMETRY  — every overlay's `fixed` containing block is the viewport
 *                  (catches the filtered-ancestor trap at its root).
 *   2. PIXELS    — sample real painted pixels inside the overlay and require
 *                  them to match the overlay's surface, not the hero photo.
 *                  Hit-testing alone is not proof of paint; this is.
 *   3. HIT TEST  — elementFromPoint inside the overlay lands in the overlay.
 *   4. ISOLATION — components that stack internally are stacking contexts, so
 *                  their local layers cannot leak upward again.
 *
 * It also writes a SCREENSHOT STATE per case, so "menu open" is a first-class
 * visual state that gets looked at, not just the default page view. States land
 * in .screenshots/ (gitignored).
 *
 * Usage: node scripts/overlay-stacking.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:4310";
const SHOTS = ".screenshots";

/* Pages that put something visually loud behind the chrome — a carousel or a
   scroll-scrub image band. These are where a stacking regression shows up
   first. `/approach` is here for the timeline's raised nodes. */
const PAGES = [
  { path: "/", name: "home", note: "hero carousel + scroll-scrub band" },
  { path: "/services", name: "services", note: "control — plain page" },
  { path: "/approach", name: "approach", note: "process timeline raised nodes" },
];

/* Viewports. The Contact dropdown is `hidden sm:block`, so it does not exist
   below 640px — it is exercised at 768px, where the mobile menu still applies
   (the menu is `lg:hidden`, i.e. present below 1024px). */
const MOBILE = { width: 390, height: 844 };
const TABLET = { width: 768, height: 1024 };

const failures = [];
const passes = [];
const fail = (m) => failures.push(m);
const pass = (m) => passes.push(m);

const near = (a, b, tol = 2) => Math.abs(a - b) <= tol;

/** Mean RGB of a small patch of the real screenshot, via canvas-free decoding. */
async function samplePixels(page, box) {
  const buf = await page.screenshot({
    clip: { x: box.x, y: box.y, width: box.w, height: box.h },
  });
  // Decode the PNG through the browser itself — no image library needed.
  const b64 = buf.toString("base64");
  return page.evaluate(async (data) => {
    const img = new Image();
    img.src = "data:image/png;base64," + data;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const { data: px } = ctx.getImageData(0, 0, c.width, c.height);
    let r = 0, g = 0, b = 0;
    const n = px.length / 4;
    for (let i = 0; i < px.length; i += 4) {
      r += px[i];
      g += px[i + 1];
      b += px[i + 2];
    }
    return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
  }, b64);
}

/**
 * Assert an overlay genuinely sits above the page: correct containing block,
 * a hit test that lands inside it, and painted pixels that match its own
 * surface rather than whatever is behind it.
 */
async function assertOverlayOnTop(page, { label, selector, expectFullViewport }) {
  const geo = await page.evaluate(
    ({ selector, expectFullViewport }) => {
      const el = document.querySelector(selector);
      if (!el) return { missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);

      // Walk up looking for an ancestor that captures `fixed` descendants.
      const traps = [];
      for (let n = el.parentElement; n; n = n.parentElement) {
        const s = getComputedStyle(n);
        const why = [];
        if (s.transform !== "none") why.push("transform");
        if (s.filter !== "none") why.push("filter");
        if (s.backdropFilter && s.backdropFilter !== "none") why.push("backdrop-filter");
        if (s.perspective !== "none") why.push("perspective");
        if (s.contain && /paint|strict|content/.test(s.contain)) why.push(`contain:${s.contain}`);
        if (s.willChange && /transform|filter|perspective/.test(s.willChange))
          why.push(`will-change:${s.willChange}`);
        if (why.length)
          traps.push({
            tag: n.tagName.toLowerCase(),
            cls: (n.className ?? "").toString().slice(0, 60),
            why,
          });
      }

      return {
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        zIndex: cs.zIndex,
        viewport: { w: innerWidth, h: innerHeight },
        // Only `fixed` overlays must span the viewport; a dropdown is absolute.
        position: cs.position,
        traps: cs.position === "fixed" ? traps : [],
        expectFullViewport,
      };
    },
    { selector, expectFullViewport },
  );

  if (geo.missing) {
    fail(`${label}: element not found (${selector})`);
    return;
  }

  // 1. GEOMETRY — the trap that actually caused the bug.
  if (expectFullViewport) {
    const ok =
      near(geo.rect.h, geo.viewport.h) &&
      near(geo.rect.w, geo.viewport.w) &&
      near(geo.rect.y, 0);
    if (!ok) {
      fail(
        `${label}: fixed overlay does not span the viewport — ` +
          `got ${Math.round(geo.rect.w)}x${Math.round(geo.rect.h)} at y=${Math.round(geo.rect.y)}, ` +
          `expected ${geo.viewport.w}x${geo.viewport.h} at y=0. ` +
          (geo.traps.length
            ? `A filtered/transformed ancestor is capturing its containing block: ` +
              geo.traps.map((t) => `<${t.tag} class="${t.cls}"> [${t.why.join("+")}]`).join(", ")
            : "No filtered ancestor found — check inset/height rules."),
      );
      return;
    }
    if (geo.traps.length) {
      fail(
        `${label}: fixed overlay has a containing-block trap above it — ` +
          geo.traps.map((t) => `<${t.tag} class="${t.cls}"> [${t.why.join("+")}]`).join(", "),
      );
      return;
    }
    pass(`${label}: fixed containing block is the viewport (${geo.viewport.w}x${geo.viewport.h})`);
  }

  // 2 + 3. Sample points well inside the overlay, avoiding its edges.
  const probes = await page.evaluate((selector) => {
    const el = document.querySelector(selector);
    const r = el.getBoundingClientRect();
    const pts = [
      [r.left + r.width * 0.5, r.top + r.height * 0.25],
      [r.left + r.width * 0.5, r.top + r.height * 0.5],
      [r.left + r.width * 0.5, r.top + r.height * 0.75],
    ];
    return pts.map(([x, y]) => {
      const hit = document.elementFromPoint(Math.round(x), Math.round(y));
      return {
        x: Math.round(x),
        y: Math.round(y),
        inside: !!(hit && el.contains(hit)),
        hitTag: hit?.tagName?.toLowerCase() ?? null,
        hitCls: (hit?.className ?? "").toString().slice(0, 70),
        insideHero: !!hit?.closest('[aria-roledescription="carousel"]'),
      };
    });
  }, selector);

  for (const p of probes) {
    if (!p.inside) {
      fail(
        `${label}: point (${p.x},${p.y}) inside the overlay hit <${p.hitTag} class="${p.hitCls}">` +
          (p.insideHero ? " — which is INSIDE THE HERO CAROUSEL (the reported bug)" : ""),
      );
    }
  }
  if (probes.every((p) => p.inside)) pass(`${label}: hit test lands inside the overlay at 3 points`);

  // 3. PIXELS — the overlay's own surface must be what is actually painted.
  // The hero is a dark photo (#1d1d1f base + scrim); the panel is the light
  // `--surface-raised`. Compare the painted patch against the overlay's own
  // computed background, which keeps this true if the palette ever changes.
  const expected = await page.evaluate((selector) => {
    const el = document.querySelector(selector);
    // Walk up from the overlay for the nearest opaque background it paints on.
    for (let n = el; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const m = bg.match(/rgba?\(([^)]+)\)/);
      if (!m) continue;
      const [r, g, b, a = "1"] = m[1].split(",").map((s) => parseFloat(s));
      if (a >= 0.95) return [r, g, b];
    }
    return null;
  }, selector);

  const rect = geo.rect;
  const patch = {
    x: Math.round(rect.x + rect.w * 0.35),
    y: Math.round(rect.y + rect.h * 0.45),
    w: 24,
    h: 24,
  };
  const got = await samplePixels(page, patch);

  if (expected) {
    const dist = Math.hypot(got[0] - expected[0], got[1] - expected[1], got[2] - expected[2]);
    // Generous tolerance: text glyphs and hairlines fall inside the patch.
    if (dist > 90) {
      fail(
        `${label}: painted pixels at (${patch.x},${patch.y}) are rgb(${got}) but the overlay's ` +
          `own surface is rgb(${expected}) — distance ${Math.round(dist)}. Something is painting over it.`,
      );
    } else {
      pass(`${label}: sampled pixels rgb(${got}) match the overlay surface (Δ${Math.round(dist)})`);
    }
  }

  // A hard, palette-independent backstop for the exact reported symptom: the
  // hero's dark photo must not be what we sampled inside a light panel.
  const isDark = (got[0] + got[1] + got[2]) / 3 < 90;
  const overlayIsLight = expected && (expected[0] + expected[1] + expected[2]) / 3 > 150;
  if (overlayIsLight && isDark) {
    fail(`${label}: sampled a DARK patch rgb(${got}) inside a light overlay — the hero is showing through.`);
  }
}

/** Every component that stacks internally must be its own stacking context. */
async function assertIsolation(page, label) {
  const leaks = await page.evaluate(() => {
    const out = [];
    // Any positioned element with an explicit z-index whose nearest stacking
    // context is the root — i.e. its local ordering escapes into site chrome.
    const isSC = (el) => {
      const s = getComputedStyle(el);
      if (s.isolation === "isolate") return true;
      if (s.position === "fixed" || s.position === "sticky") return true;
      if (["relative", "absolute"].includes(s.position) && s.zIndex !== "auto") return true;
      if (s.transform !== "none" || s.filter !== "none" || s.perspective !== "none") return true;
      if (s.backdropFilter && s.backdropFilter !== "none") return true;
      if (s.mixBlendMode !== "normal" || s.opacity !== "1") return true;
      if (s.contain && /paint|strict|content/.test(s.contain)) return true;
      return false;
    };

    for (const el of document.querySelectorAll("*")) {
      const s = getComputedStyle(el);
      if (s.zIndex === "auto") continue;
      if (!["relative", "absolute"].includes(s.position)) continue;
      const z = parseInt(s.zIndex, 10);
      if (!Number.isFinite(z) || z <= 0) continue;

      let sc = null;
      for (let n = el.parentElement; n; n = n.parentElement) {
        if (isSC(n)) {
          sc = n;
          break;
        }
      }
      // No stacking-context ancestor => this z-index lives in the ROOT context.
      // That is only legitimate for genuine site chrome (header and above).
      if (!sc && z < 100) {
        out.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className ?? "").toString().slice(0, 70),
          z,
        });
      }
    }
    return out;
  });

  if (leaks.length) {
    for (const l of leaks)
      fail(
        `${label}: z-index ${l.z} on <${l.tag} class="${l.cls}"> resolves in the ROOT stacking ` +
          `context — add \`isolate\` to its component root so the layer stays local.`,
      );
  } else {
    pass(`${label}: no local z-index leaks into the root stacking context`);
  }
}

/* ------------------------------------------------------------------------- */

await mkdir(SHOTS, { recursive: true });
const browser = await chromium.launch();
const shot = async (page, name) => {
  const f = path.join(SHOTS, `${name}.png`);
  await page.screenshot({ path: f });
  return f;
};
const written = [];

for (const p of PAGES) {
  /* ---- STATE: menu-open @390 ------------------------------------------- */
  {
    const ctx = await browser.newContext({ viewport: MOBILE });
    const page = await ctx.newPage();
    await page.goto(BASE + p.path, { waitUntil: "networkidle" });
    const label = `${p.name} @390 menu-open`;

    await page.getByRole("button", { name: "Open menu" }).click();
    await page.waitForTimeout(500); // slide-over transition

    // The fixed root is what the containing-block trap collapses — check its
    // geometry first, because every other symptom follows from it.
    await assertOverlayOnTop(page, {
      label: `${label} (fixed root)`,
      selector: ".fixed.inset-0.z-overlay",
      expectFullViewport: true,
    });
    // Then the panel itself: absolute inside that root, so no viewport check,
    // but its pixels and hit tests must be the ones actually on screen.
    await assertOverlayOnTop(page, {
      label: `${label} (panel)`,
      selector: '[role="dialog"][aria-label="Site navigation"]',
      expectFullViewport: false,
    });
    await assertIsolation(page, label);
    written.push(await shot(page, `${p.name}-390-menu-open`));
    await ctx.close();
  }

  /* ---- STATE: default @390 (isolation baseline) ------------------------- */
  {
    const ctx = await browser.newContext({ viewport: MOBILE });
    const page = await ctx.newPage();
    await page.goto(BASE + p.path, { waitUntil: "networkidle" });
    await assertIsolation(page, `${p.name} @390 default`);
    written.push(await shot(page, `${p.name}-390-default`));
    await ctx.close();
  }

  /* ---- STATE: contact-dropdown-open @768 -------------------------------- */
  {
    const ctx = await browser.newContext({ viewport: TABLET });
    const page = await ctx.newPage();
    await page.goto(BASE + p.path, { waitUntil: "networkidle" });
    const label = `${p.name} @768 contact-open`;

    const btn = page.getByRole("button", { name: "Contact options" });
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(350);
      await assertOverlayOnTop(page, {
        label,
        selector: 'div[aria-label="Contact"]',
        expectFullViewport: false,
      });
      written.push(await shot(page, `${p.name}-768-contact-open`));
    } else {
      fail(`${label}: contact button not visible at 768px — expected \`hidden sm:block\`.`);
    }
    await ctx.close();
  }
}

/* ---- STATE: cookie-banner @390 over the hero ---------------------------- */
{
  const ctx = await browser.newContext({ viewport: MOBILE });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const banner = page.locator('[aria-labelledby="cookie-consent-title"]');
  if (await banner.count()) {
    await assertOverlayOnTop(page, {
      label: "home @390 cookie-banner",
      selector: '[aria-labelledby="cookie-consent-title"]',
      expectFullViewport: false,
    });
    written.push(await shot(page, "home-390-cookie-banner"));
  } else {
    pass("home @390 cookie-banner: not shown (consent already stored) — skipped");
  }
  await ctx.close();
}

await browser.close();

/* ---- report -------------------------------------------------------------- */
await writeFile(
  path.join(SHOTS, "STATES.md"),
  `# Visual check states\n\nRegenerate: \`npm run gate:stacking\`\n\n` +
    written.map((f) => `- ${f}`).join("\n") +
    "\n",
);

for (const p of passes) console.log(`  ok   ${p}`);
if (failures.length) {
  console.log("");
  for (const f of failures) console.log(`  FAIL ${f}`);
  console.log(`\noverlay-stacking: FAIL — ${failures.length} problem(s)`);
  console.log(`screenshot states in ${SHOTS}/`);
  process.exit(1);
}
console.log(`\noverlay-stacking: PASS — ${passes.length} assertion(s), ${written.length} states in ${SHOTS}/`);
