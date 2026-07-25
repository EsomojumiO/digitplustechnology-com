/**
 * gen-branded-cover.mjs — generate an ORIGINAL branded typographic cover.
 *
 * Produces a 1600×900 JPEG: the article title set on a deep-green Digitplus
 * gradient, with the category label and wordmark. These are our own design —
 * no stock photography, so no wrong-country / wrong-scene risk (the recurring
 * imagery defect), and every cover is unique (no duplicate-cover violation).
 * The matching alt honestly describes a typographic cover, not a photograph.
 *
 * Usage: node scripts/gen-branded-cover.mjs "<slug>" "<Title>" "<Category>"
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

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

const out = `public/images/insights/${slug}.jpg`;
const buf = await sharp(Buffer.from(svg)).jpeg({ quality: 86, progressive: true }).toBuffer();
writeFileSync(out, buf);
console.log(`wrote ${out} (${W}×${H}, ${(buf.length / 1024).toFixed(0)} KB, ${lines.length} title lines @ ${fontSize}px)`);
