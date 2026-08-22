#!/usr/bin/env node
/**
 * draft-status.mjs — which insight drafts exist, and which still lack a cover.
 *
 *   npm run content:drafts
 *
 * This exists because those two numbers kept being written down. A count pasted
 * into a doc is correct on the day it is pasted and silently wrong afterwards —
 * docs/BLOCKERS.md carried "19 drafts" for two months, then "18" for a day.
 * Derive them here instead; the docs point at this command rather than quoting
 * a figure.
 *
 * Reads the same directories the site does, so it cannot disagree with the
 * build: content/insights for articles, public/images/insights for covers.
 * Archived drafts (archive/) are deliberately invisible to it, exactly as they
 * are to the loader.
 */
import fs from "node:fs";
import path from "node:path";
import { config } from "../content-engine/config.mjs";

const rows = fs
  .readdirSync(config.insightsDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => {
    const slug = f.replace(/\.mdx$/, "");
    const src = fs.readFileSync(path.join(config.insightsDir, f), "utf8");
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src)?.[1] ?? "";
    return {
      slug,
      draft: /^draft:\s*true\s*$/m.test(fm),
      cover: fs.existsSync(path.join(config.imagesDir, `${slug}.jpg`)),
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

const drafts = rows.filter((r) => r.draft);
const missing = drafts.filter((r) => !r.cover);

if (missing.length) {
  console.log(`Drafts with NO cover file (${missing.length}) — cannot publish until fixed:`);
  for (const r of missing) console.log(`  ${r.slug}`);
  console.log("");
}
const ready = drafts.filter((r) => r.cover);
if (ready.length) {
  console.log(`Drafts with a cover (${ready.length}):`);
  for (const r of ready) console.log(`  ${r.slug}`);
  console.log("");
}
console.log(
  `${rows.length} insight articles: ${rows.length - drafts.length} published, ` +
    `${drafts.length} draft (${missing.length} of those missing a cover).`,
);
