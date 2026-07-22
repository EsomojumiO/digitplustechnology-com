import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export interface CTABandProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Action buttons / links slot. */
  actions?: React.ReactNode;
}

/* One band, no tone prop. `inverse` went first (post-flip it was pixel-identical
   to `surface`); `accent` — a full-width ORANGE band — had zero call sites and
   would have broken the one-orange-fill-per-viewport rule the moment anyone used
   it. Zero call sites + compile-time enforcement beats convention, so it's
   deleted rather than left as a loaded gun. */
const BAND = "bg-surface text-text border-y border-hairline";

/**
 * CTABand, full-width call-to-action band.
 */
export function CTABand({
  title,
  description,
  actions,
  className,
  ...props
}: CTABandProps) {
  return (
    <section className={cn(BAND, "py-16 sm:py-20", className)} {...props}>
      <Container>
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-h2 max-w-[20ch]">{title}</h2>
            {description ? (
              <p
                className={cn(
                  // text-muted, never opacity-85: alpha-on-text was the
                  // dark-canvas idiom and dissolves on white.
                  "text-body-lg measure lede text-muted",
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
