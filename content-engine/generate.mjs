/**
 * generate.mjs — Generate a quality-gated batch of articles from the backlog.
 *
 *   node content-engine/generate.mjs --count 4            # write 4 pending briefs
 *   node content-engine/generate.mjs --count 1 --dry-run  # preview MDX, write nothing
 *   node content-engine/generate.mjs --count 8 --cluster banking --market Kenya
 *
 * Pulls `pending` briefs from the backlog, runs each through the pipeline, writes
 * accepted articles to content/insights/<slug>.mdx (draft:true), and records the
 * outcome (written / held) back onto the backlog. Phased-cluster cadence: run a
 * small batch, review the drafts, publish, repeat — do NOT bulk-publish 1,000.
 */

import fs from "node:fs";
import path from "node:path";
import { config } from "./config.mjs";
import { generateArticle } from "./pipeline.mjs";
import { provider } from "./lib/anthropic.mjs";

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : def;
}
const flag = (name) => process.argv.includes(`--${name}`);

function loadBacklog() {
  if (!fs.existsSync(config.backlogPath)) {
    throw new Error(`No backlog at ${config.backlogPath}. Run: node content-engine/plan.mjs --count 50`);
  }
  return JSON.parse(fs.readFileSync(config.backlogPath, "utf8"));
}
function saveBacklog(b) {
  fs.writeFileSync(config.backlogPath, JSON.stringify(b, null, 2));
}

/** Simple bounded-concurrency pool. */
async function pool(items, size, worker) {
  const results = [];
  let i = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
  return results;
}

async function main() {
  const count = Number(arg("count", 5));
  const dryRun = flag("dry-run");
  const cluster = arg("cluster", null);
  const market = arg("market", null);
  const date = new Date().toISOString().slice(0, 10);

  const backlog = loadBacklog();
  const pending = backlog.filter(
    (b) => b.status === "pending" &&
      (!cluster || b.cluster === cluster) &&
      (!market || b.market === market),
  );
  const batch = pending.slice(0, count);

  if (batch.length === 0) {
    console.log("[generate] no pending briefs match. Run plan.mjs or relax --cluster/--market.");
    return;
  }

  console.log(`[generate] ${dryRun ? "DRY-RUN " : ""}processing ${batch.length} briefs ` +
    `(provider: ${provider()}), concurrency ${config.concurrency}.`);

  let written = 0, held = 0;

  await pool(batch, dryRun ? 1 : config.concurrency, async (brief) => {
    try {
      const r = await generateArticle(brief, { date, dryRun });
      if (r.status === "previewed") {
        console.log(`\n${"─".repeat(72)}\n[preview] ${brief.title}  (QA ${r.qa.score})\n${"─".repeat(72)}`);
        console.log(r.mdx);
        return;
      }
      const entry = backlog.find((b) => b.id === brief.id);
      if (r.status === "written") {
        written++;
        if (entry) { entry.status = "written"; entry.qaScore = r.qa.score; entry.file = path.relative(config.repoRoot, r.file); }
        console.log(`  ✓ ${brief.title}  (QA ${r.qa.score}) → ${path.relative(config.repoRoot, r.file)}`);
      } else {
        held++;
        if (entry) { entry.status = "held"; entry.qaScore = r.qa.score; entry.heldReasons = r.reasons; }
        console.log(`  ⚠ HELD ${brief.title}  (QA ${r.qa.score}) — ${r.reasons.join("; ")}`);
      }
    } catch (e) {
      const entry = backlog.find((b) => b.id === brief.id);
      if (entry) { entry.status = "error"; entry.error = e.message; }
      console.log(`  ✗ ERROR ${brief.title} — ${e.message}`);
    }
  });

  if (!dryRun) saveBacklog(backlog);

  console.log(`\n[generate] done. written ${written}, held ${held}. ` +
    (dryRun ? "(dry-run — nothing saved)" : "All written articles are draft:true — review, then flip draft:false."));
  if (written > 0 && !dryRun) {
    console.log("[generate] next: fetch covers for the new slugs, review drafts, then publish a cluster at a time.");
  }
}

main().catch((e) => {
  console.error("[generate] failed:", e.message);
  process.exit(1);
});
