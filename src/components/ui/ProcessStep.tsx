import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProcessStepProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Step number (1-based). */
  step: number;
  title: React.ReactNode;
  description?: React.ReactNode;
}

/**
 * ProcessStep, a numbered step in a how-we-work sequence.
 */
export function ProcessStep({
  step,
  title,
  description,
  className,
  ...props
}: ProcessStepProps) {
  return (
    <div className={cn("flex gap-4", className)} {...props}>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface text-small font-semibold tabular-nums text-accent"
        aria-hidden="true"
      >
        {String(step).padStart(2, "0")}
      </span>
      <div className="flex flex-col gap-1.5 pt-1">
        <h3 className="text-h4 text-text">{title}</h3>
        {description ? (
          <p className="text-body text-muted measure">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export default ProcessStep;
