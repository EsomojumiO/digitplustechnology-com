import * as React from "react";
import { cn } from "@/lib/utils";

export interface EyebrowProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
}

/**
 * Eyebrow — small uppercase accent label that sits above a heading.
 */
export function Eyebrow({
  as: Comp = "p",
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <Comp
      className={cn(
        // Monospace technical label — restrained-futurism precision signal.
        "font-mono text-caption font-medium uppercase tracking-[0.18em] text-accent",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Eyebrow;
