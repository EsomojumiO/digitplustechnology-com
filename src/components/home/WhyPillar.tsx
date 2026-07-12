import * as React from "react";

export interface WhyPillarProps {
  /** Short mono keyword, e.g. "Accountable". */
  label: string;
  /** One-line consequence, e.g. "one partner, end to end.". */
  beat: string;
  /** The longer supporting copy from the whyUs data. */
  description: React.ReactNode;
}

/**
 * WhyPillar, Raycast-style two-beat pillar: a mono keyword + one-line
 * consequence leading the longer supporting copy. Presentational; the parent
 * staggers these in.
 */
export function WhyPillar({ label, beat, description }: WhyPillarProps) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-lg border border-hairline bg-surface-raised p-8">
      <p className="flex flex-wrap items-baseline gap-x-2 text-h4 leading-snug text-text">
        <span className="font-mono text-caption font-medium uppercase tracking-[0.16em] text-accent-green">
          {label}
        </span>
        <span className="text-muted/60" aria-hidden="true">
, 
        </span>
        <span className="font-medium">{beat}</span>
      </p>
      <p className="text-body text-muted measure">{description}</p>
    </div>
  );
}

export default WhyPillar;
