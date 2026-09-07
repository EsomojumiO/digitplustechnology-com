import * as React from "react";
import { Card } from "@/components/ui";

export interface WhyPillarProps {
  /** Short mono keyword, e.g. "Accountable". */
  label: string;
  /** One-line consequence, e.g. "one partner, end to end.". */
  beat: string;
  /** The longer supporting copy from the whyUs data. */
  description: React.ReactNode;
  /**
   * Heading level for the label/beat line. It was a <p> carrying `text-h4`,
   * so it read as a heading and sat outside the outline — while the same
   * `whyUs` data on /about renders through an <h3>.
   */
  headingAs?: "h2" | "h3" | "h4";
}

/**
 * WhyPillar, Raycast-style two-beat pillar: a mono keyword + one-line
 * consequence leading the longer supporting copy. Presentational; the parent
 * staggers these in.
 */
export function WhyPillar({
  label,
  beat,
  description,
  headingAs: Heading = "h3",
}: WhyPillarProps) {
  return (
    <Card padding="lg" className="flex h-full flex-col gap-3">
      <Heading className="flex flex-wrap items-baseline gap-x-2 text-h4 leading-snug text-text">
        <span className="text-caption font-semibold text-accent-green">
          {label}
        </span>
        <span className="text-muted" aria-hidden="true">
,
        </span>
        <span className="font-medium">{beat}</span>
      </Heading>
      <p className="text-body text-muted measure">{description}</p>
    </Card>
  );
}

export default WhyPillar;
