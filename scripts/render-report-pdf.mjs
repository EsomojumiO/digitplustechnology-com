/**
 * render-report-pdf.mjs — turn a full report's Markdown into the gated PDF.
 *
 * The web page at /reports/<slug> is the ungated preview (content/reports/).
 * The full report lives as plain Markdown in docs/reports/<slug>.md, so it can
 * be edited and reviewed like any other text file, and this script prints it
 * to public/reports/<slug>.pdf with real Chromium. One source, one command:
 * the PDF can never drift from the Markdown, because it is always rebuilt
 * from it.
 *
 * Usage: node scripts/render-report-pdf.mjs <slug>
 * Needs Playwright's Chromium (npx playwright install chromium).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];
if (!slug) {
  console.error("Usage: render-report-pdf.mjs <slug>");
  process.exit(1);
}

const src = path.join(repoRoot, "docs", "reports", `${slug}.md`);
if (!existsSync(src)) {
  console.error(`No report source at ${path.relative(repoRoot, src)}`);
  process.exit(1);
}

const markdown = readFileSync(src, "utf8");
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);
const hast = await processor.run(processor.parse(markdown));
const body = renderToStaticMarkup(toJsxRuntime(hast, { Fragment, jsx, jsxs }));

// Title for the running header: the first H1 in the source.
const title = (/^#\s+(.+)$/m.exec(markdown)?.[1] ?? slug).trim();

// Brand values from src/app/globals.css: Forest-500 ink, Ember-700 links,
// warm khaki hairlines. Print is light-only, like the site.
const css = `
  @page { size: A4; margin: 22mm 20mm 24mm; }
  :root { --ink: #1d1d1f; --muted: #6e6e73; --green: #2d5d49; --ember: #8c3820; --hair: #e4ddcb; --band: #f5f5f7; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif; color: var(--ink);
         font-size: 10.5pt; line-height: 1.6; margin: 0; }
  h1 { font-size: 30pt; line-height: 1.1; letter-spacing: -0.02em; color: var(--green);
       margin: 0 0 10mm; padding-top: 50mm; page-break-after: avoid; }
  h1 + p { font-size: 13pt; color: var(--muted); }
  h2 { font-size: 17pt; letter-spacing: -0.01em; color: var(--green); margin: 12mm 0 4mm;
       padding-top: 4mm; border-top: 1px solid var(--hair); page-break-after: avoid; }
  h3 { font-size: 12pt; margin: 7mm 0 2mm; page-break-after: avoid; }
  p, li { max-width: 165mm; orphans: 3; widows: 3; }
  a { color: var(--ember); text-decoration: none; }
  blockquote { margin: 5mm 0; padding: 3mm 5mm; background: var(--band); border-left: 3px solid var(--green); }
  blockquote p { margin: 0; }
  table { width: 100%; border-collapse: collapse; margin: 4mm 0 6mm; font-size: 9.5pt; page-break-inside: avoid; }
  th, td { text-align: left; padding: 2mm 3mm; border-bottom: 1px solid var(--hair); vertical-align: top; }
  th { color: var(--green); font-weight: 600; }
  hr { border: 0; border-top: 1px solid var(--hair); margin: 8mm 0; }
  code { font-size: 9pt; }
`;

const html = `<!doctype html><html lang="en-NG"><head><meta charset="utf-8"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>${css}</style></head><body>${body}</body></html>`;

const footer = `<div style="font-family:Helvetica,Arial,sans-serif;font-size:7.5pt;color:#6e6e73;width:100%;padding:0 20mm;display:flex;justify-content:space-between">
  <span>Digitplus Technology Limited · digitplustechnology.com</span>
  <span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;

// REPORT_HTML_OUT=<file> also writes the print HTML, for previewing the layout
// as screenshots where no PDF rasteriser is installed.
if (process.env.REPORT_HTML_OUT) writeFileSync(process.env.REPORT_HTML_OUT, html);

const outDir = path.join(repoRoot, "public", "reports");
mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${slug}.pdf`);

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: out,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: footer,
    margin: { top: "22mm", bottom: "24mm", left: "20mm", right: "20mm" },
  });
} finally {
  await browser.close();
}
console.log(`wrote ${path.relative(repoRoot, out)}`);
