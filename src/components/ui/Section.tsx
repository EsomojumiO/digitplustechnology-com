import * as React from "react";
import { cn } from "@/lib/utils";
import { Container, type ContainerProps } from "./Container";

type SectionTone = "default" | "muted" | "raised";

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Background tone for alternating surfaces. */
  tone?: SectionTone;
  /** Vertical rhythm. */
  spacing?: "sm" | "md" | "lg";
  /** Wrap children in a Container (default true). */
  contained?: boolean;
  containerWidth?: ContainerProps["width"];
}

/* TWO tones, by design: white canvas and the #f5f5f7 band. Apple's rhythm is
   two-tone; green is ink, never canvas.

   `inverse` is GONE, not aliased. After the light flip --brand and --surface
   both resolved to #f5f5f7, so tone="inverse" and tone="muted" rendered
   identically — a third code path that produced a second tone's pixels. An
   alias would have kept that dead path alive; deleting it makes the type system
   enforce the two-tone rule at every call site.

   `raised` is still white — it's the hairline-bounded variant of the canvas,
   not a third colour. */
const tones: Record<SectionTone, string> = {
  default: "bg-background text-text",
  muted: "bg-surface text-text",
  raised: "bg-surface-raised text-text border-y border-hairline",
};

/* Spec: 120–160px desktop, 64–80px mobile. The dark theme ran 64/96 for `md`,
   which on white reads as crowded — separation now comes from whitespace and
   background alternation alone, so the air IS the design, not padding around it.
   `sm` stays deliberately tighter: it's for incidental bands (the trust strip),
   not for content sections. */
const spacings = {
  sm: "py-12 sm:py-20", // 48 / 80
  md: "py-16 sm:py-32", // 64 / 128
  lg: "py-20 sm:py-40", // 80 / 160
};

/**
 * Section, consistent vertical rhythm with optional alternating surface tone.
 */
export function Section({
  tone = "default",
  spacing = "md",
  contained = true,
  containerWidth = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    // data-tone/data-spacing drive the stacked-same-tone collapse in
    // globals.css — two adjacent sections of the same tone would otherwise
    // stack their padding into a hole (measured: 439px of nothing on /about).
    <section
      data-tone={tone}
      data-spacing={spacing}
      className={cn(tones[tone], spacings[spacing], className)}
      {...props}
    >
      {contained ? (
        <Container width={containerWidth}>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
}

export default Section;
