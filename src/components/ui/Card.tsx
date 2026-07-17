import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  /** Lift on hover (use for interactive/link cards). */
  interactive?: boolean;
  /** Inner padding. */
  padding?: "none" | "sm" | "md" | "lg";
  /** Set when rendering the card as an anchor (`as="a"`). */
  href?: string;
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Card, soft surface with hairline border and optional hover elevation.
 */
export function Card({
  as: Comp = "div",
  interactive = false,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Comp
      className={cn(
        "rounded-lg border border-hairline bg-surface-raised",
        paddings[padding],
        interactive &&
          "transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)] hover:border-hairline-hover " +
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Card;
