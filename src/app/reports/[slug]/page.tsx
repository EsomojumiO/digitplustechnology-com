import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Section,
  Container,
  Breadcrumbs,
  Badge,
  Card,
  Prose,
  Eyebrow,
} from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { ReportGateForm } from "@/components/forms";
import {
  getAllReports,
  getReportBySlug,
  MDXContent,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { JsonLd } from "@/lib/seo/jsonld";
import { reportSchema, breadcrumbSchema } from "@/lib/seo/schema";

/** Static generation: one page per known report, no on-demand params. */
export const dynamicParams = false;
/** ISR, revalidate hourly so freshly-published reports appear without a redeploy. */
export const revalidate = 3600;

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
  const description = report.seo.metaDescription || report.summary;
  const ogImage = report.seo.ogImage || report.cover;
  const url = `${siteConfig.url}/reports/${report.slug}`;

  return {
    title,
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
      <Section spacing="lg" className="pb-10 sm:pb-12">
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
              <Badge tone="neutral">Quarterly report</Badge>
            </div>
            <h1 className="text-h1 text-balance text-text">{report.title}</h1>
            {report.summary ? (
              <p className="measure text-body-lg text-muted">{report.summary}</p>
            ) : null}
            <p className="text-small text-muted">
              Published {publishedLabel} · Digitplus Technology
            </p>
          </FadeIn>

          {/* Cover, neutral surface fallback when the asset is absent. */}
          <FadeIn
            delay={0.08}
            className="relative order-first aspect-[3/4] overflow-hidden rounded-lg bg-surface cover-dark lg:order-none"
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
                What the data shows
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
                    className="mt-0.5 shrink-0 text-h4 font-semibold tabular-nums text-accent-green/70"
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
                <MDXContent source={report.body} />
              </Prose>
            </FadeIn>
          </Container>
        </Section>
      ) : null}

      {/* ── Gated full-report download ─────────────────────────────────── */}
      <Section tone="muted" spacing="lg">
        <Container width="narrow" className="px-0">
          <Card padding="lg">
            <div className="flex flex-col gap-2">
              <Eyebrow>Full report</Eyebrow>
              <h2 className="text-h3 text-balance text-text">
                Download the full report (PDF)
              </h2>
              <p className="text-body text-muted">
                The complete edition includes category-level pricing, the
                methodology behind every figure, and procurement guidance for the
                quarter ahead. Tell us where to send it.
              </p>
            </div>

            <div className="mt-8">
              <ReportGateForm
                reportSlug={report.slug}
                reportTitle={report.title}
              />
            </div>

            <p className="mt-6 border-t border-hairline pt-5 text-caption text-muted">
              We ask for a work email so we can confirm your request and send the
              occasional follow-up report. Your details are never sold or shared
              with third parties, and you can unsubscribe at any time.
            </p>
          </Card>
        </Container>
      </Section>
    </>
  );
}
