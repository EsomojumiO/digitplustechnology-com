import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subhead?: React.ReactNode;
  /** CTA buttons / links slot. */
  actions?: React.ReactNode;
  /** Small reassurance line under the CTAs (e.g. coverage areas). */
  coverage?: React.ReactNode;
  /** Optional visual placed alongside on wide screens. */
  media?: React.ReactNode;
}

/**
 * Hero — large, confident hero scaffold with generous air.
 * Eyebrow, title, subhead, CTA slot and a coverage line.
 */
export function Hero({
  eyebrow,
  title,
  subhead,
  actions,
  coverage,
  media,
  className,
  ...props
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24",
        className,
      )}
      {...props}
    >
      <Container>
        <div
          className={cn(
            "flex flex-col gap-10",
            media && "lg:flex-row lg:items-center lg:gap-16",
          )}
        >
          <div className={cn("flex flex-col gap-6", media && "lg:flex-1")}>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <h1 className="text-display max-w-[18ch] text-text">{title}</h1>
            {subhead ? (
              <p className="text-body-lg measure text-muted">{subhead}</p>
            ) : null}
            {actions ? (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            ) : null}
            {coverage ? (
              <p className="text-small mt-1 text-muted">{coverage}</p>
            ) : null}
          </div>
          {media ? (
            <div className="lg:flex-1">{media}</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

export default Hero;
