import type { Metadata } from "next";
import { Section, SectionHeading, Card } from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { NewsletterForm } from "@/components/forms";
import { getAllReports, getFeaturedReport } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { ReportCard } from "./_components/ReportCard";

const TITLE = "Enterprise IT Reports for Nigeria";
const DESCRIPTION =
  "Data-rich, citable research on enterprise IT in Nigeria from Digitplus Technology — pricing, procurement, and infrastructure trends for decision-makers. Read the public findings, download the full reports.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/reports" },
  openGraph: {
    title: `${TITLE} | ${siteConfig.shortName}`,
    description: DESCRIPTION,
    url: `${siteConfig.url}/reports`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${siteConfig.shortName}`,
    description: DESCRIPTION,
  },
};

export default function ReportsHubPage() {
  const featured = getFeaturedReport();
  const all = getAllReports();
  // Archive = everything except the featured slot (featured is the latest
  // non-archived; the rest, including archived, fall into the archive grid).
  const archive = featured
    ? all.filter((r) => r.slug !== featured.slug)
    : all;

  return (
    <>
      <Section spacing="lg" className="pb-12 sm:pb-16">
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="Research"
            title="Quarterly reports"
            lede="Independent, data-led research on the cost and shape of enterprise IT in Nigeria — written to be read, cited, and acted on. Every report opens with public findings; the full analysis is a free download."
          />
        </FadeIn>
      </Section>

      {featured ? (
        <Section spacing="sm" className="pt-0">
          <FadeIn>
            <ReportCard report={featured} variant="feature" headingLevel="h2" />
          </FadeIn>
        </Section>
      ) : null}

      {archive.length > 0 ? (
        <Section tone="muted" spacing="md">
          <SectionHeading
            as="h2"
            title="Report archive"
            lede="Past editions remain available in full — track how the numbers have moved quarter on quarter."
            className="mb-10 sm:mb-12"
          />
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((report) => (
              <StaggerItem key={report.slug} className="h-full">
                <ReportCard report={report} className="h-full" />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      ) : null}

      {!featured && archive.length === 0 ? (
        <Section spacing="md" className="pt-0">
          <Card padding="lg">
            <p className="text-body-lg text-muted">
              Our first quarterly report is in preparation. Subscribe below and
              we will send it the day it publishes.
            </p>
          </Card>
        </Section>
      ) : null}

      <Section spacing="md">
        <Card padding="lg" className="bg-surface">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-xl flex-col gap-3">
              <h2 className="text-h3 text-balance text-text">
                Get the next report first
              </h2>
              <p className="text-body text-muted">
                One quarterly email when a new report is published. No noise, no
                third-party sharing — unsubscribe any time.
              </p>
            </div>
            <NewsletterForm
              idPrefix="reports-newsletter"
              buttonLabel="Notify me"
              className="w-full lg:max-w-md"
            />
          </div>
        </Card>
      </Section>
    </>
  );
}
