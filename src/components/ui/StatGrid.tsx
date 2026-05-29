import * as React from "react";
import { cn } from "@/lib/utils";
import { Stat, type StatProps } from "./Stat";

export interface StatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StatProps[];
  /** Hairline dividers between stats (on wide screens). */
  divided?: boolean;
}

/**
 * StatGrid — responsive row of Stat figures, optionally divided by hairlines.
 */
export function StatGrid({
  items,
  divided = true,
  className,
  ...props
}: StatGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4",
        divided &&
          "lg:divide-x lg:divide-hairline lg:[&>*:not(:first-child)]:pl-8",
        className,
      )}
      {...props}
    >
      {items.map((item, i) => (
        <Stat key={i} {...item} />
      ))}
    </div>
  );
}

export default StatGrid;
