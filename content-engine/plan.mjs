/**
 * plan.mjs — Build or extend the topic backlog.
 *
 *   node content-engine/plan.mjs --count 50
 *
 * Runs the strategist to append `count` new, deduplicated briefs to
 * content-engine/topics/backlog.json. Re-run until you reach your target
 * (e.g. 1,000) — each run sees prior titles and avoids overlap.
 */

import fs from "node:fs";
import path from "node:path";
import { config } from "./config.mjs";
import { strategist } from "./agents.mjs";
import { makeDedup, slugify } from "./lib/content.mjs";
import { provider } from "./lib/anthropic.mjs";

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : def;
}

function loadBacklog() {
  if (!fs.existsSync(config.backlogPath)) return [];
  return JSON.parse(fs.readFileSync(config.backlogPath, "utf8"));
}

function existingArticleTitles() {
  if (!fs.existsSync(config.insightsDir)) return [];
  return fs
    .readdirSync(config.insightsDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const m = fs.readFileSync(path.join(config.insightsDir, f), "utf8").match(/^title:\s*"?(.+?)"?\s*$/m);
      return m ? m[1] : null;
    })
    .filter(Boolean);
}

async function main() {
  const count = Number(arg("count", 50));
  const backlog = loadBacklog();

  const knownTitles = [...existingArticleTitles(), ...backlog.map((b) => b.title)];
  const dedup = makeDedup(knownTitles);

  console.log(`[plan] generating ${count} briefs (provider: ${provider()})…`);
  console.log(`[plan] backlog currently holds ${backlog.length}; ${knownTitles.length} known titles.`);

  const topics = await strategist({ count, knownTitles });

  let added = 0, skipped = 0;
  for (const t of topics) {
    if (!t?.title) { skipped++; continue; }
    const dup = dedup.isDup(t.title);
    if (dup.dup) { skipped++; continue; }
    dedup.add(t.title);
    backlog.push({
      id: `t_${Date.now().toString(36)}_${added}`,
      status: "pending",
      slug: slugify(t.title),
      ...t,
    });
    added++;
  }

  fs.mkdirSync(path.dirname(config.backlogPath), { recursive: true });
  fs.writeFileSync(config.backlogPath, JSON.stringify(backlog, null, 2));

  const byCluster = backlog.reduce((m, b) => ((m[b.cluster] = (m[b.cluster] || 0) + 1), m), {});
  console.log(`[plan] added ${added}, skipped ${skipped} (dupes/invalid). Backlog now ${backlog.length}.`);
  console.log(`[plan] by cluster:`, byCluster);
  console.log(`[plan] → ${path.relative(config.repoRoot, config.backlogPath)}`);
}

main().catch((e) => {
  console.error("[plan] failed:", e.message);
  process.exit(1);
});
