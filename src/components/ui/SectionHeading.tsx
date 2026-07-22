import * as React from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { AnimatedRule } from "@/components/motion/AnimatedRule";

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Heading level for correct document outline. */
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  /** Draw the Connective Line above the heading. Opt out for dense/inline heads. */
  rule?: boolean;
}

/**
 * SectionHeading, eyebrow + title + lede with consistent rhythm.
 *
 * Centered by default: the Apple-light spec migrates section headlines to
 * centre while body copy stays left. Pass align="left" for the exceptions.
 *
 * Renders the Connective Line — the short green rule that draws itself in on
 * section entry. Note this is a NEW feature, not a port: AnimatedRule existed
 * as dead code with zero call sites on every branch. This is its first use.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Heading = "h2",
  align = "center",
  rule = true,
  className,
  ...props
}: SectionHeadingProps) {
  const headingSize = Heading === "h1" ? "text-h1" : "text-h2";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
      {...props}
    >
      {rule ? <AnimatedRule className="w-10" /> : null}
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading className={cn(headingSize, "text-text")}>{title}</Heading>
      {lede ? (
        <p
          className={cn(
            "text-body-lg text-muted measure lede",
            align === "center" && "mx-auto",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
