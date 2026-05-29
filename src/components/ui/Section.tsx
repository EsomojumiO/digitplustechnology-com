import * as React from "react";
import { cn } from "@/lib/utils";
import { Container, type ContainerProps } from "./Container";

type SectionTone = "default" | "muted" | "raised" | "inverse";

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

const tones: Record<SectionTone, string> = {
  default: "bg-background text-text",
  muted: "bg-surface text-text",
  raised: "bg-surface-raised text-text border-y border-hairline",
  inverse: "bg-brand text-brand-foreground",
};

const spacings = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-24 sm:py-32",
};

/**
 * Section — consistent vertical rhythm with optional alternating surface tone.
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
    <section className={cn(tones[tone], spacings[spacing], className)} {...props}>
      {contained ? (
        <Container width={containerWidth}>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
}

export default Section;
