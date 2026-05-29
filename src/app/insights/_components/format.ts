/**
 * format.ts — Small, dependency-free formatting helpers for Insights pages.
 *
 * Dates are rendered with a fixed locale + UTC time zone so server (build) and
 * any client island agree byte-for-byte (no hydration mismatch).
 */

/** Format an ISO 8601 date as "29 May 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/** Machine-readable date for the <time> dateTime attribute (YYYY-MM-DD). */
export function isoDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}
