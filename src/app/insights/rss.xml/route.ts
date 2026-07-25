/**
 * GET /insights/rss.xml — RSS 2.0 feed of published insights.
 *
 * Static (force-static): built once, served from the CDN, regenerated on
 * redeploy — the same model as the articles themselves. Draft articles are
 * excluded because getAllArticles() returns published only.
 */
import { getAllArticles } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const site = siteConfig.url;
  const articles = getAllArticles();
  const latest = articles[0]?.updatedAt ?? articles[0]?.publishedAt;

  const items = articles
    .map((a) => {
      const url = `${site}/insights/${a.slug}`;
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(a.category.label)}</category>
      <description>${escapeXml(a.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Insights</title>
    <link>${site}/insights</link>
    <atom:link href="${site}/insights/rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical IT strategy, procurement, infrastructure and managed-services thinking for Nigerian decision-makers.</description>
    <language>en-NG</language>
${latest ? `    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
