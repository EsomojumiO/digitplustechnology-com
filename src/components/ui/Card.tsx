import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  /** Lift on hover (use for interactive/link cards). */
  interactive?: boolean;
  /** Inner padding. */
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Card — soft surface with hairline border and optional hover elevation.
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
          "transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] hover:border-neutral-300",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Card;
