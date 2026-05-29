/**
 * sitemap.ts — Auto-generated sitemap.xml (Next MetadataRoute.Sitemap).
 *
 * Covers every indexable route:
 *   - static marketing pages
 *   - /services + 6 detail pages
 *   - /industries + 8 detail pages
 *   - /locations + 3 city pages
 *   - /insights + category archives (only categories with published articles)
 *   - every published article and report
 *
 * All URLs are absolute (siteConfig.url). lastModified uses updatedAt /
 * publishedAt where available so crawlers see real freshness signals.
 */
import type { MetadataRoute } from "next";
import { siteConfig, services, industries } from "@/lib/site";
import { locations } from "@/data/locations";
import {
  getAllArticles,
  getAllReports,
  getAllCategories,
} from "@/lib/content";

type Entry = MetadataRoute.Sitemap[number];

function url(path: string): string {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Core static routes ────────────────────────────────────────────────
  const staticEntries: Entry[] = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: url("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/industries"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/approach"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/insights"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: url("/reports"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/locations"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ── Service detail pages (6) ──────────────────────────────────────────
  const serviceEntries: Entry[] = services.map((s) => ({
    url: url(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // ── Industry detail pages (8) ─────────────────────────────────────────
  const industryEntries: Entry[] = industries.map((i) => ({
    url: url(`/industries/${i.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // ── Location pages (3) ────────────────────────────────────────────────
  const locationEntries: Entry[] = locations.map((l) => ({
    url: url(`/locations/${l.slug}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  // ── Insights category archives (only non-empty) ───────────────────────
  const categoryEntries: Entry[] = getAllCategories().map((c) => ({
    url: url(`/insights/category/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  // ── Articles ──────────────────────────────────────────────────────────
  const articleEntries: Entry[] = getAllArticles().map((a) => ({
    url: url(`/insights/${a.slug}`),
    lastModified: new Date(a.updatedAt || a.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // ── Reports ───────────────────────────────────────────────────────────
  const reportEntries: Entry[] = getAllReports().map((r) => ({
    url: url(`/reports/${r.slug}`),
    lastModified: new Date(r.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...industryEntries,
    ...locationEntries,
    ...categoryEntries,
    ...articleEntries,
    ...reportEntries,
  ];
}
