/**
 * source.ts, Low-level content SOURCE adapter (the swappable internals).
 *
 * This is the ONLY module that knows content lives as MDX files on disk and is
 * parsed with gray-matter. Everything above it (articles.ts, reports.ts) works
 * with already-parsed `{ data, content, slug }` records.
 *
 * THE CMS SEAM lives here: to move to Sanity/Payload, reimplement
 * `readCollection` / `readEntry` to fetch from the CMS API and return the same
 * `RawEntry[]` shape. articles.ts / reports.ts and all pages stay untouched.
 *
 * Runs SERVER-SIDE at build time only (uses node fs). Never import from a
 * client component.
 */

import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** A single parsed content file: frontmatter + raw body + derived slug. */
export interface RawEntry {
  /** Frontmatter object (untyped at this layer; validated upstream). */
  data: Record<string, unknown>;
  /** Raw MDX/markdown body (no frontmatter). */
  content: string;
  /** Filename without extension, the canonical slug. */
  slug: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

/** Resolve a content collection directory, e.g. "insights" -> /content/insights. */
function collectionDir(collection: string): string {
  return path.join(CONTENT_ROOT, collection);
}

/**
 * Read + parse every `.mdx` file in a collection directory.
 * Returns [] if the directory does not exist (so a fresh checkout never throws).
 */
export function readCollection(collection: string): RawEntry[] {
  const dir = collectionDir(collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => parseFile(dir, file));
}

/** Read + parse a single entry by slug, or null if the file is absent. */
export function readEntry(collection: string, slug: string): RawEntry | null {
  const dir = collectionDir(collection);
  const filePath = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseFile(dir, `${slug}.mdx`);
}

function parseFile(dir: string, file: string): RawEntry {
  const filePath = path.join(dir, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    data: data as Record<string, unknown>,
    content,
    slug: file.replace(/\.mdx$/, ""),
  };
}

/* ---------------------------------------------------------------------------
   Frontmatter normalization helpers, defensive coercion so a small editor
   mistake (a date typed as a JS Date, a missing boolean) never breaks a build.
   --------------------------------------------------------------------------- */

/** Coerce a frontmatter date value to an ISO 8601 string. */
export function toISO(value: unknown, fallback?: string): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value.trim()) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  if (fallback) return fallback;
  return new Date(0).toISOString();
}

/** Coerce to boolean with a default (handles "true"/"false" strings). */
export function toBool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim().toLowerCase() === "true";
  return fallback;
}

/** Coerce to a string array (accepts a single string, comma list, or array). */
export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

/** Coerce to a trimmed string with a default. */
export function toStr(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
}

/** Extract a nested SEO object safely. */
export function toSeo(value: unknown): {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
} {
  if (!value || typeof value !== "object") return {};
  const seo = value as Record<string, unknown>;
  const out: { metaTitle?: string; metaDescription?: string; ogImage?: string } = {};
  if (typeof seo.metaTitle === "string") out.metaTitle = seo.metaTitle;
  if (typeof seo.metaDescription === "string") out.metaDescription = seo.metaDescription;
  if (typeof seo.ogImage === "string") out.ogImage = seo.ogImage;
  return out;
}
