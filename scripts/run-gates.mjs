/**
 * run-gates.mjs — the gate suite, one command.
 *
 * Runs all five drift-protection gates against a already-running server, in
 * order, and exits non-zero if ANY of them fails. This is the single entry
 * point to run before every commit/push:
 *
 *   npm run build && npx next start -p 4310 &
 *   npm run gates                 # or: npm run gates http://localhost:4310
 *
 * The internal-link audit (orphans/depth/anchors) is a full member here — an
 * orphaned or too-deep indexable page now fails the suite, same as a contrast
 * or axe regression.
 *
 * overlay-stacking is the newest member. It checks OPEN states (mobile menu,
 * contact dropdown, cookie banner) rather than the default page view — the
 * mobile-nav-behind-the-hero bug was invisible to every other gate because
 * every other gate only ever looked at a page with nothing open.
 */
import { spawnSync } from "node:child_process";

const url = process.argv[2] ?? "http://localhost:4310";

const GATES = [
  { name: "style-conformance", cmd: "node", args: ["--experimental-strip-types", "scripts/style-conformance.ts", url] },
  { name: "a11y-sweep", cmd: "node", args: ["scripts/a11y-sweep.mjs", url] },
  { name: "hero-contrast", cmd: "node", args: ["scripts/hero-contrast.mjs", url] },
  { name: "internal-link-audit", cmd: "node", args: ["scripts/internal-link-audit.mjs", url] },
  { name: "overlay-stacking", cmd: "node", args: ["scripts/overlay-stacking.mjs", url] },
];

const failed = [];
for (const g of GATES) {
  console.log(`\n──────── ${g.name} ────────`);
  const r = spawnSync(g.cmd, g.args, { stdio: "inherit" });
  if (r.status !== 0) failed.push(g.name);
}

console.log("\n════════ gate suite ════════");
if (failed.length) {
  console.log(`FAIL — ${failed.join(", ")}`);
  process.exit(1);
}
console.log(`PASS — all ${GATES.length} gates green`);
