import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The headline figure, e.g. "8". */
  value: React.ReactNode;
  /** Supporting label, e.g. "Enterprise clients". */
  label: React.ReactNode;
  /** Optional finer print under the label. */
  description?: React.ReactNode;
}

/**
 * Stat, a single by-the-numbers figure with label.
 */
export function Stat({
  value,
  label,
  description,
  className,
  ...props
}: StatProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      <span className="font-mono text-stat font-medium tabular-nums text-text">
        {value}
      </span>
      <span className="text-caption font-medium text-muted">
        {label}
      </span>
      {description ? (
        <span className="text-small text-muted">{description}</span>
      ) : null}
    </div>
  );
}

export default Stat;
