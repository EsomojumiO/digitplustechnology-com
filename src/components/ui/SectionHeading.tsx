import * as React from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Heading level for correct document outline. */
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
}

/**
 * SectionHeading, eyebrow + title + lede with consistent rhythm.
 *
 * Centered by default: the Apple-light spec migrates section headlines to
 * centre while body copy stays left. Pass align="left" for the exceptions.
 *
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Heading = "h2",
  align = "center",
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
