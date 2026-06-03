/**
 * reports.ts, Public access layer for quarterly Reports.
 *
 * PUBLIC API (the CMS seam, keep these signatures stable):
 *   getAllReports(): ReportMeta[]      // non-archived first, newest first
 *   getReportBySlug(slug): Report | null
 *   getFeaturedReport(): ReportMeta | null   // latest non-archived
 *   getArchivedReports(): ReportMeta[]
 *
 * Server-only. The ungated narrative body + key findings are PUBLIC/indexable;
 * the gated asset is the `pdf` path (gating is enforced by the reports page +
 * forms layer, not here).
 */

import "server-only";
import {
  type Report,
  type ReportMeta,
} from "./types";
import {
  readCollection,
  readEntry,
  toISO,
  toBool,
  toStr,
  toStringArray,
  toSeo,
  type RawEntry,
} from "./source";

const COLLECTION = "reports";

function toReport(entry: RawEntry): Report {
  const { data, content, slug } = entry;

  const yearRaw = data.year;
  const year =
    typeof yearRaw === "number"
      ? yearRaw
      : Number.parseInt(toStr(yearRaw, "0"), 10) || new Date().getFullYear();

  return {
    title: toStr(data.title, slug),
    slug: toStr(data.slug, slug) || slug,
    quarter: toStr(data.quarter),
    year,
    cover: toStr(data.cover, `/images/reports/${slug}.jpg`),
    coverAlt: toStr(data.coverAlt),
    summary: toStr(data.summary),
    keyFindings: toStringArray(data.keyFindings),
    pdf: toStr(data.pdf, `/reports/${slug}.pdf`),
    publishedAt: toISO(data.publishedAt),
    archived: toBool(data.archived, false),
    seo: toSeo(data.seo),
    body: content,
  };
}

function toMeta(report: Report): ReportMeta {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, ...meta } = report;
  return meta;
}

/** All reports mapped, sorted: non-archived first, then newest publish date. */
function loadAll(): Report[] {
  return readCollection(COLLECTION)
    .map(toReport)
    .sort((a, b) => {
      if (a.archived !== b.archived) return a.archived ? 1 : -1;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });
}

/* --------------------------------- PUBLIC --------------------------------- */

/** All reports (non-archived first, newest first). */
export function getAllReports(): ReportMeta[] {
  return loadAll().map(toMeta);
}

/** Full report (incl. ungated MDX body) by slug, or null if missing. */
export function getReportBySlug(slug: string): Report | null {
  const entry = readEntry(COLLECTION, slug);
  if (!entry) return null;
  return toReport(entry);
}

/** The latest non-archived report, for the hub "featured" slot. */
export function getFeaturedReport(): ReportMeta | null {
  return getAllReports().find((r) => !r.archived) ?? null;
}

/** Archived reports only, newest first. */
export function getArchivedReports(): ReportMeta[] {
  return getAllReports().filter((r) => r.archived);
}
