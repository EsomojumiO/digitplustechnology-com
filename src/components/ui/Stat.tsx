import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The headline figure, e.g. "50+". */
  value: React.ReactNode;
  /** Supporting label, e.g. "Enterprise clients". */
  label: React.ReactNode;
  /** Optional finer print under the label. */
  description?: React.ReactNode;
}

/**
 * Stat — a single by-the-numbers figure with label.
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
      <span className="text-h1 font-semibold tracking-tight text-text">
        {value}
      </span>
      <span className="text-body font-medium text-text">{label}</span>
      {description ? (
        <span className="text-small text-muted">{description}</span>
      ) : null}
    </div>
  );
}

export default Stat;
