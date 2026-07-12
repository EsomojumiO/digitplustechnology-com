import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ReportMeta } from "@/lib/content";

export interface ReportCardProps {
  report: ReportMeta;
  /**
   * "feature" = prominent two-column hero treatment for the latest report.
   * "compact" = standard archive grid card.
   */
  variant?: "feature" | "compact";
  /** Heading level for correct document outline (default h3). */
  headingLevel?: "h2" | "h3";
  className?: string;
}

/** Human label for the report period, e.g. "Q2 2026". */
function periodLabel(report: ReportMeta): string {
  return [report.quarter, report.year].filter(Boolean).join(" ");
}

/**
 * Cover, next/image over a neutral surface so a missing asset degrades to a
 * clean panel rather than broken-image chrome. `sizes` is tuned per variant.
 */
function Cover({
  report,
  variant,
  className,
}: {
  report: ReportMeta;
  variant: "feature" | "compact";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface cover-dark",
        className,
      )}
    >
      {report.cover ? (
        <Image
          src={report.cover}
          alt={report.coverAlt || `${report.title} cover`}
          fill
          sizes={
            variant === "feature"
              ? "(min-width: 1024px) 38rem, 100vw"
              : "(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover"
        />
      ) : null}
    </div>
  );
}

/**
 * ReportCard, the single card primitive used across the reports hub for both
 * the featured hero and the archive grid. Composed from design-system Card.
 */
export function ReportCard({
  report,
  variant = "compact",
  headingLevel: Heading = "h3",
  className,
}: ReportCardProps) {
  const href = `/reports/${report.slug}`;
  const period = periodLabel(report);

  if (variant === "feature") {
    return (
      <Card
        padding="none"
        interactive
        className={cn(
          "group relative overflow-hidden bg-surface-raised/70 backdrop-blur-sm transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-hairline-hover hover:shadow-[var(--shadow-md)]",
          className,
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <Cover
            report={report}
            variant="feature"
            className="aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[24rem]"
          />
          <div className="flex flex-col gap-5 p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone="accent">Latest report</Badge>
              {period ? <Badge tone="outline">{period}</Badge> : null}
            </div>
            <Heading className="text-h2 text-balance text-text">
              <Link
                href={href}
                className="rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline focus-visible:decoration-accent-green"
              >
                {report.title}
              </Link>
            </Heading>
            {report.summary ? (
              <p className="measure text-body-lg text-muted">{report.summary}</p>
            ) : null}
            <span className="mt-1 inline-flex items-center gap-1.5 text-body font-medium text-accent-green">
              Read the report
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] group-hover:translate-x-0.5"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      as="article"
      padding="none"
      interactive
      className={cn(
        "group relative flex flex-col overflow-hidden bg-surface-raised/70 backdrop-blur-sm transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-hairline-hover hover:shadow-[var(--shadow-md)]",
        className,
      )}
    >
      <Cover report={report} variant="compact" className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        {period ? (
          <Badge tone="neutral" className="self-start">
            {period}
          </Badge>
        ) : null}
        <Heading className="text-h4 text-balance text-text">
          <Link
            href={href}
            className="rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline focus-visible:decoration-accent-green"
          >
            {report.title}
          </Link>
        </Heading>
        {report.summary ? (
          <p className="text-body text-muted line-clamp-3">{report.summary}</p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-small font-medium text-accent-green">
          Read the report
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] group-hover:translate-x-0.5"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </Card>
  );
}

export default ReportCard;
