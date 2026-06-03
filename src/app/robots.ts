/**
 * robots.ts, Auto-generated robots.txt (Next MetadataRoute.Robots).
 *
 * Allow everything crawlable; keep API routes out of the index. Points crawlers
 * at the sitemap and declares the canonical host so duplicate-host variants
 * consolidate (www-vs-non-www is also enforced at DNS/Vercel, see next.config).
 */
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
