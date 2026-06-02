import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal primitives are now React-INDEPENDENT. They render a `.reveal-init`
 * marker class plus CSS custom props; the vanilla `/reveal.js` script (loaded in
 * the root layout) adds `.reveal-in` when the element scrolls into view. This
 * works identically in every browser and can never leave content stuck hidden
 * (CSS only hides while `html.reveal-ready` is set, which `/reveal.js` controls).
 *
 * These are plain components (no hooks), so they're usable in both server and
 * client trees with no hydration concerns.
 */
export function revealStyle(
  distance: number,
  delay: number,
  style?: React.CSSProperties,
): React.CSSProperties {
  return {
    ...({
      "--reveal-distance": `${distance}px`,
      "--reveal-delay": delay ? `${delay}ms` : "0ms",
    } as React.CSSProperties),
    ...style,
  };
}

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  /** Stagger the reveal by N ms. */
  delay?: number;
  /** Translate distance in px before reveal. */
  distance?: number;
  /** Accepted for API compatibility; reveal-once is the only behavior. */
  once?: boolean;
}

export function Reveal({
  as: Comp = "div",
  delay = 0,
  distance = 16,
  once,
  className,
  style,
  children,
  ...props
}: RevealProps) {
  void once;
  return (
    <Comp
      className={cn("reveal-init", className)}
      style={revealStyle(distance, delay, style)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Reveal;
