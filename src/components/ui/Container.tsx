import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as a different element (e.g. "section", "header"). */
  as?: React.ElementType;
  /** Narrower max-width for reading-focused layouts. */
  width?: "default" | "narrow" | "wide";
}

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-[75rem]", // ~1200px
  wide: "max-w-[85rem]",
};

/**
 * Container — centered max-width wrapper (~1200px) with fluid gutters.
 */
export function Container({
  as: Comp = "div",
  width = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Comp
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        widths[width],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Container;
