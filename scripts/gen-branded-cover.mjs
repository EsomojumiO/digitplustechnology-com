/**
 * gen-branded-cover.mjs — generate an ORIGINAL branded typographic cover.
 *
 * Produces a 1600×900 JPEG: the article title set on a deep-green Digitplus
 * gradient, with the category label and wordmark. These are our own design —
 * no stock photography, so no wrong-country / wrong-scene risk (the recurring
 * imagery defect), and every cover is unique (no duplicate-cover violation).
 *
 * The matching `coverAlt` IS WRITTEN HERE, in the same step as the image, for
 * the same reason fetch-covers.mjs writes it: a script that swaps the cover and
 * leaves the alt alone lets the two drift apart silently, and every renderer
 * falls back to `|| title`, so nothing in the build notices. This script used to
 * be exactly that hole — it claimed a matching alt in this comment and never
 * wrote one.
 *
 * This cover is the easy case: it is our own design, so its content is fully
 * known here. The alt is derived from the very strings drawn into the image, and
 * describes it as what it is — type on a gradient, not a photograph. It
 * deliberately never claims a scene, a place or a person.
 *
 * Usage: node scripts/gen-branded-cover.mjs "<slug>" "<Title>" "<Category>"
 */
import sharp from "sharp";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setCoverAlt } from "../content-engine/fetch-covers.mjs";

// Anchor to the repo, not the caller's cwd — the output path was relative
// before, so this only worked when invoked from the repo root.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const [slug, title, category] = process.argv.slice(2);
if (!slug || !title || !category) {
  console.error('Usage: gen-branded-cover.mjs "<slug>" "<Title>" "<Category>"');
  process.exit(1);
}

const W = 1600, H = 900;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Greedy word-wrap for the title. Approx glyph width for a bold sans ≈ 0.56·fs.
function wrap(text, fontSize, maxWidth) {
  const cpl = Math.max(8, Math.floor(maxWidth / (fontSize * 0.56)));
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (t.length > cpl && line) { lines.push(line); line = w; }
    else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

// Fit the title to at most 4 lines by stepping the font size down.
let fontSize = 84;
let lines = wrap(title, fontSize, W - 240);
while (lines.length > 4 && fontSize > 52) {
  fontSize -= 6;
  lines = wrap(title, fontSize, W - 240);
}
const lineHeight = fontSize * 1.16;
const blockH = lines.length * lineHeight;
const startY = H / 2 - blockH / 2 + fontSize * 0.8;

const titleTspans = lines
  .map((l, i) => `<tspan x="120" y="${Math.round(startY + i * lineHeight)}">${esc(l)}</tspan>`)
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2d5d49"/>
      <stop offset="1" stop-color="#1b3a2d"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="10" height="${H}" fill="#5c9c82"/>
  <text x="120" y="150" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700"
        letter-spacing="3" fill="#a7d0bf">${esc(category.toUpperCase())}</text>
  <text font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700"
        fill="#ffffff">${titleTspans}</text>
  <line x1="120" y1="${H - 150}" x2="${W - 120}" y2="${H - 150}" stroke="#5c9c82" stroke-opacity="0.5" stroke-width="1"/>
  <text x="120" y="${H - 100}" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700"
        fill="#ffffff">Digitplus Technology</text>
  <text x="${W - 120}" y="${H - 100}" text-anchor="end" font-family="Helvetica, Arial, sans-serif"
        font-size="24" font-weight="500" letter-spacing="2" fill="#a7d0bf">INSIGHTS</text>
</svg>`;

/**
 * Alt text for a typographic cover.
 *
 * Not truncated to fetch-covers' 160-char ALT_MAX, deliberately: on a photo that
 * cap stops a caption sprawling, but here the title IS the image's content.
 * Clipping it would make the alt describe less than the picture shows, which is
 * the defect this whole exercise exists to prevent.
 */
function brandedAlt(t, c) {
  const tidy = (v) => String(v).replace(/\s+/g, " ").trim();
  return `Branded cover: the article title "${tidy(t)}" set in white on a dark green gradient, labelled ${tidy(c)}, with the Digitplus Technology wordmark.`;
}

const out = path.join(repoRoot, "public", "images", "insights", `${slug}.jpg`);
const buf = await sharp(Buffer.from(svg)).jpeg({ quality: 86, progressive: true }).toBuffer();
writeFileSync(out, buf);
console.log(`wrote ${path.relative(repoRoot, out)} (${W}×${H}, ${(buf.length / 1024).toFixed(0)} KB, ${lines.length} title lines @ ${fontSize}px)`);

// Same step as the image, so the two cannot get out of sync.
const article = path.join(repoRoot, "content", "insights", `${slug}.mdx`);
if (!existsSync(article)) {
  console.error(`WARNING: no article at ${path.relative(repoRoot, article)} — coverAlt NOT written.`);
  console.error("The image now has no alt describing it. Write one, or the cover ships unlabelled.");
  process.exit(1);
}
const before = readFileSync(article, "utf8");
const after = setCoverAlt(before, brandedAlt(title, category));
if (after === before) {
  console.log(`coverAlt already matches in ${path.relative(repoRoot, article)}`);
} else {
  writeFileSync(article, after);
  console.log(`wrote coverAlt in ${path.relative(repoRoot, article)}`);
}

// Record the cover in CREDITS.json too. This script wrote no row at all before,
// which is why four branded covers sat in that ledger's blind spot looking like
// stock photos whose photographer had been lost. Same shape as every other row;
// `origin` is what says no attribution is owed.
const creditsPath = path.join(repoRoot, "public", "images", "insights", "CREDITS.json");
const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, "utf8")) : {};
credits[slug] = {
  origin: "digitplus-branded",
  photographer: null,
  profile: null,
  source: null,
  query: null,
  note: "Original Digitplus typographic cover generated by scripts/gen-branded-cover.mjs. Not a photograph; no attribution owed.",
};
const sorted = Object.fromEntries(Object.keys(credits).sort().map((k) => [k, credits[k]]));
writeFileSync(creditsPath, JSON.stringify(sorted, null, 2) + "\n");
console.log(`recorded ${slug} in ${path.relative(repoRoot, creditsPath)}`);
