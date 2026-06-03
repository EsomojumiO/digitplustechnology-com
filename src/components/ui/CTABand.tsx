import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export interface CTABandProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Action buttons / links slot. */
  actions?: React.ReactNode;
  tone?: "accent" | "inverse" | "surface";
}

const tones = {
  accent: "bg-accent text-accent-foreground",
  inverse: "bg-brand text-brand-foreground",
  surface: "bg-surface text-text border-y border-hairline",
};

/**
 * CTABand, full-width call-to-action band.
 */
export function CTABand({
  title,
  description,
  actions,
  tone = "inverse",
  className,
  ...props
}: CTABandProps) {
  const onColor = tone === "surface";
  return (
    <section className={cn(tones[tone], "py-16 sm:py-20", className)} {...props}>
      <Container>
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-h2 max-w-[20ch]">{title}</h2>
            {description ? (
              <p
                className={cn(
                  "text-body-lg measure",
                  onColor ? "text-muted" : "opacity-85",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

export default CTABand;
