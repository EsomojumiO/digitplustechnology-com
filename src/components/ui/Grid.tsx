import * as React from "react";
import { cn } from "@/lib/utils";

type Cols = 1 | 2 | 3 | 4;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  /** Target columns at the largest breakpoint; scales down responsively. */
  columns?: Cols;
  gap?: "sm" | "md" | "lg";
}

/* Static maps so Tailwind can statically detect the classes. */
const colClasses: Record<Cols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const gaps = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

/**
 * Grid, responsive column grid (1–4 columns) with consistent gaps.
 */
export function Grid({
  as: Comp = "div",
  columns = 3,
  gap = "md",
  className,
  children,
  ...props
}: GridProps) {
  return (
    <Comp
      className={cn("grid", colClasses[columns], gaps[gap], className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Grid;
