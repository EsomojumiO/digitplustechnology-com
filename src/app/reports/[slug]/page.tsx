import type { Metadata } from "next";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Section,
  Container,
  Breadcrumbs,
  Badge,
  Card,
  Prose,
  proseMdxComponents,
  Eyebrow,
  Button,
} from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { ReportGateForm } from "@/components/forms";
import {
  getAllReports,
  getReportBySlug,
  MDXContent,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { ctaLabels } from "@/lib/cta";
import { JsonLd } from "@/lib/seo/jsonld";
import { clampDescription } from "@/lib/seo/metadata";
import { reportSchema, breadcrumbSchema } from "@/lib/seo/schema";

/** Static generation: one page per known report, no on-demand params. */
export const dynamicParams = false;
/** ISR, revalidate hourly so freshly-published reports appear without a redeploy. */
export const revalidate = 3600;

/**
 * The report's PDF, if a real one is on disk. Anything under 10 KB is treated
 * as absent: the earlier placeholders were ~770-byte one-page stubs, and a
 * download button in front of one of those is the problem BLOCKERS #10 records.
 */
function realPdf(href: string): { sizeLabel: string } | null {
  if (!href.startsWith("/")) return null;
  const file = path.join(process.cwd(), "public", href);
  if (!existsSync(file)) return null;
  const bytes = statSync(file).size;
  if (bytes < 10 * 1024) return null;
  const mb = bytes / (1024 * 1024);
  return { sizeLabel: mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB` };
}

export function generateStaticParams() {
  return getAllReports().map((report) => ({ slug: report.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = getReportBySlug(slug);
  if (!report) return { title: "Report not found" };

  const period = [report.quarter, report.year].filter(Boolean).join(" ");
  const title = report.seo.metaTitle || report.title;
  const description = clampDescription(
    report.seo.metaDescription || report.summary,
  );
  const ogImage = report.seo.ogImage || report.cover;
  const url = `${siteConfig.url}/reports/${report.slug}`;

  return {
    // Absolute: report titles are long; the brand suffix would push them past
    // the ~60-char SERP cutoff. The title stands alone.
    title: { absolute: title },
    description,
    alternates: { canonical: `/reports/${report.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: report.publishedAt,
      images: ogImage
        ? [{ url: ogImage, alt: report.coverAlt || report.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    other: period ? { "article:section": period } : undefined,
  };
}

export default async function ReportLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = getReportBySlug(slug);
  if (!report) notFound();

  const pdf = realPdf(report.pdf);
  const period = [report.quarter, report.year].filter(Boolean).join(" ");
  const publishedLabel = new Date(report.publishedAt).toLocaleDateString(
    "en-GB",
    { year: "numeric", month: "long" },
  );

  const url = `${siteConfig.url}/reports/${report.slug}`;

  return (
    <>
      <JsonLd data={reportSchema(report, url)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Reports", url: "/reports" },
          { name: report.title },
        ])}
      />
      {/* ── Ungated, indexable preview ─────────────────────────────────── */}
      {/* pb-12 both ways: pb-10 is 40px, which is not on ALLOWED_PY. It was
          mobile-only, so the 1440-px-only gate never rendered it. */}
      <Section spacing="lg" className="pb-12">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Reports", href: "/reports" },
            { label: report.title },
          ]}
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <FadeIn className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2.5">
              {period ? <Badge tone="accent">{period}</Badge> : null}
              <Badge tone="neutral">
                {report.quarter === "Annual" ? "Annual report" : "Quarterly report"}
              </Badge>
            </div>
            <h1 className="text-h1 text-balance text-text">{report.title}</h1>
            {report.summary ? (
              <p className="measure lede text-body-lg text-muted">{report.summary}</p>
            ) : null}
            <p className="text-small text-muted">
              Published {publishedLabel} · Digitplus Technology
            </p>
          </FadeIn>

          {/* Cover, neutral surface fallback when the asset is absent. */}
          <FadeIn
            delay={80}
            className="relative order-first aspect-[3/4] overflow-hidden rounded-lg bg-surface cover lg:order-none"
          >
            {report.cover ? (
              <Image
                src={report.cover}
                alt={report.coverAlt || `${report.title} cover`}
                fill
                priority
                sizes="(min-width: 1024px) 22rem, 100vw"
                className="object-cover"
              />
            ) : null}
          </FadeIn>
        </div>
      </Section>

      {report.keyFindings.length > 0 ? (
        <Section tone="muted" spacing="md">
          <FadeIn className="flex flex-col gap-8 lg:max-w-3xl">
            <div className="flex flex-col gap-3">
              <Eyebrow>Key findings</Eyebrow>
              <h2 className="text-h2 text-balance text-text">
                {/* Not "What the data shows" — both editions state their
                    figures are directional, not survey data. */}
                What we are seeing
              </h2>
            </div>
            <ul className="flex flex-col">
              {report.keyFindings.map((finding, i) => (
                <li
                  key={i}
                  className="flex gap-4 border-b border-hairline py-5 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-h4 font-semibold tabular-nums text-accent-green"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-body-lg text-text">{finding}</p>
                </li>
              ))}
            </ul>
          </FadeIn>
        </Section>
      ) : null}

      {report.body.trim() ? (
        <Section spacing="md">
          <Container width="narrow" className="px-0">
            <FadeIn>
              <Prose>
                <MDXContent source={report.body} components={proseMdxComponents} />
              </Prose>
            </FadeIn>
          </Container>
        </Section>
      ) : null}

      {/*
        ── Full-report download ─────────────────────────────────────────────
        GATED when a real PDF exists (over 10 KB; the old ~770-byte stubs never
        qualify, BLOCKERS #10). The gate came back on 2026-10-09 once leads had
        somewhere real to go: every submission lands in public.website_leads in
        the dp-os Supabase project. Marketing email only goes to people who
        tick the unticked-by-default box (NDPA consent). Without a real PDF the
        card falls back to a conversation, and asks for nothing.
      */}
      <Section tone="muted" spacing="lg">
        <Container width="narrow" className="px-0">
          <Card padding="lg">
            {pdf ? (
              <>
                <div className="flex flex-col gap-2">
                  <Eyebrow>Full report</Eyebrow>
                  <h2 className="text-h3 text-balance text-text">
                    Read the whole edition
                  </h2>
                  <p className="text-body text-muted">
                    The full report carries the detail behind every finding
                    above, with numbered sources. PDF, {pdf.sizeLabel}. Tell us
                    who you are and the download opens straight away.
                  </p>
                </div>
                <ReportGateForm
                  className="mt-8"
                  reportSlug={report.slug}
                  reportTitle={report.title}
                />
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  {/* Not "Full report": this branch does not contain one. */}
                  <Eyebrow>Go deeper</Eyebrow>
                  <h2 className="text-h3 text-balance text-text">
                    Want the underlying detail?
                  </h2>
                  <p className="text-body text-muted">
                    The findings above are the substance of this edition. For the
                    category-level detail behind them, or to talk through what it
                    means for a specific procurement cycle, speak to us directly.
                  </p>
                </div>
                <div className="mt-8">
                  <Button href="/contact" size="lg">
                    {ctaLabels.generic}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </Container>
      </Section>
    </>
  );
}
