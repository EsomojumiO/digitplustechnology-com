/*
 * hero-contrast.mjs — worst-case pixel contrast for the hero overlay text.
 *
 * The scrim only guarantees legibility if it's actually dark enough behind the
 * text, and a bright image region can defeat it. So this measures the REAL
 * rendered composite (image + scrim, as the browser paints it), not the scrim
 * math and not an average:
 *
 *   for each slide, for each text element:
 *     hide the text, screenshot the exact box it occupied,
 *     and over every pixel find the one that MINIMISES contrast with the
 *     text colour (brightest pixel for white text; the pixel nearest the
 *     text's own luminance for the mid-tone green eyebrow).
 *
 * Fails loud if any element's worst-case pixel is < 4.5:1.
 */
import { chromium } from "playwright";
import sharp from "sharp";

const BASE = process.argv[2] ?? "http://localhost:4310";
const WIDTHS = [1440, 390];

const lin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (l1, l2) =>
  (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

// Composite a possibly-translucent text colour over a bg pixel (worst case for
// white/85 support text: it darkens toward the bg).
const composite = (fg, bg) => {
  const a = fg.a ?? 1;
  return [
    fg.r * a + bg[0] * (1 - a),
    fg.g * a + bg[1] * (1 - a),
    fg.b * a + bg[2] * (1 - a),
  ];
};

const browser = await chromium.launch();
let failures = 0;

for (const width of WIDTHS) {
  // Measure under REDUCED MOTION: autoplay is off and the fade duration is 0, so
  // slides swap instantly and no two are ever on screen together. Under
  // no-preference the crossfade briefly shows two slides, and the incoming
  // slide's white text bleeds into the outgoing slide's region — a phantom
  // 1.00:1. The image+scrim composite we're measuring is identical either way;
  // this just gives clean, single-slide frames.
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  // Dismiss the cookie banner — it's a fixed white overlay that, on mobile,
  // sits over the hero's lower-left, so hiding the hero text to sample the
  // background would otherwise capture the banner's white instead of the image.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find(
      (x) => x.textContent?.trim() === "Decline",
    );
    b?.click();
  });
  // Wait out the banner's fade-out — the first slides measure before it clears
  // otherwise, catching the tail of the exit animation as residual white.
  await page.waitForTimeout(900);

  const count = await page.evaluate(
    () => document.querySelectorAll('[aria-roledescription="slide"]').length,
  );

  // Park the mouse inside the hero so autoplay (stopOnMouseEnter) stays paused.
  // Without this, autoplay crossfades mid-measurement and the NEXT slide's white
  // text bleeds into the captured region — a false 1.00:1 on random elements.
  await page.mouse.move(width / 2, 300);
  await page.waitForTimeout(200);

  for (let i = 0; i < count; i++) {
    // Activate slide i via its indicator, let the fade settle.
    await page.evaluate((idx) => {
      const btns = [
        ...document.querySelectorAll('button[aria-label^="Show slide"]'),
      ];
      btns[idx]?.click();
    }, i);
    await page.waitForTimeout(700);

    // Text elements on the active slide, with their colours.
    const targets = await page.evaluate((idx) => {
      const slide = document.querySelectorAll('[aria-roledescription="slide"]')[idx];
      const block = slide.querySelector(".flex.flex-col");
      const items = [];
      const push = (el, label) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;
        // Canonicalise the colour through a canvas: fillStyle accepts ANY CSS
        // colour form (rgb, oklab, named, color(srgb …)) and getImageData hands
        // back sRGB 0–255 + straight alpha. Parsing the string ourselves broke
        // on Tailwind's oklab output — it reads `oklab(1 0 0 / .85)` as if the
        // L/a/b were RGB, so white text scored as near-black.
        const cv = document.createElement("canvas");
        cv.width = cv.height = 1;
        const cx = cv.getContext("2d");
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = getComputedStyle(el).color;
        cx.fillRect(0, 0, 1, 1);
        const [pr, pg, pb, pa] = cx.getImageData(0, 0, 1, 1).data;
        items.push({
          label,
          rect: { x: r.x, y: r.y, w: r.width, h: r.height },
          fg: { r: pr, g: pg, b: pb, a: pa / 255 },
        });
      };
      // Select by role-class, not position — the headline is an <h1> on slide 1
      // and a <p class="text-h1"> elsewhere, so index-based selection mislabels.
      push(block.querySelector("p.text-caption"), "eyebrow");
      push(block.querySelector("h1, p.text-h1"), "headline");
      push(block.querySelector("p.text-body-lg"), "support");
      // outline CTA label sits on the image; orange CTA is a solid fill (skip).
      const cta = block.querySelector("a");
      if (cta && !cta.className.includes("bg-accent")) push(cta, "cta");
      return items;
    }, i);

    // Hide the whole text block, then screenshot each element's box (now bg-only).
    for (const t of targets) {
      await page.evaluate((idx) => {
        const slide = document.querySelectorAll('[aria-roledescription="slide"]')[idx];
        slide.querySelector(".flex.flex-col").style.visibility = "hidden";
      }, i);
      const clip = {
        x: Math.max(0, Math.floor(t.rect.x)),
        y: Math.max(0, Math.floor(t.rect.y)),
        width: Math.ceil(t.rect.w),
        height: Math.ceil(t.rect.h),
      };
      const buf = await page.screenshot({ clip });
      await page.evaluate((idx) => {
        const slide = document.querySelectorAll('[aria-roledescription="slide"]')[idx];
        slide.querySelector(".flex.flex-col").style.visibility = "";
      }, i);

      const { data, info } = await sharp(buf)
        .raw()
        .toBuffer({ resolveWithObject: true });
      const ch = info.channels;
      let worst = Infinity;
      for (let p = 0; p < data.length; p += ch) {
        const bg = [data[p], data[p + 1], data[p + 2]];
        const eff = composite(t.fg, bg);
        const c = contrast(lum(eff[0], eff[1], eff[2]), lum(bg[0], bg[1], bg[2]));
        if (c < worst) worst = c;
      }
      const ok = worst >= 4.5;
      if (!ok) failures++;
      console.log(
        `  ${String(width).padStart(4)}px slide ${i + 1} ${t.label.padEnd(9)} worst=${worst.toFixed(2)}:1 ${ok ? "PASS" : "*** FAIL ***"}`,
      );
    }
  }
  await ctx.close();
}

await browser.close();
console.log(
  failures === 0
    ? "\nhero-contrast: PASS — every overlay text element ≥ 4.5:1 worst-case"
    : `\nhero-contrast: FAIL — ${failures} element(s) below 4.5:1`,
);
process.exit(failures === 0 ? 0 : 1);
