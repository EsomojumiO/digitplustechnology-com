import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * hasPublicFile — server-only check that a file exists under /public. Evaluated
 * at build time (SSG) / on regeneration (ISR), so page components can degrade
 * gracefully when a curated image has not been downloaded yet. Never import from
 * a client component.
 */
export function hasPublicFile(publicPath: string): boolean {
  const rel = publicPath.replace(/^\//, "");
  try {
    return existsSync(join(process.cwd(), "public", rel));
  } catch {
    return false;
  }
}
