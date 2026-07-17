import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * AnimatedRule — the site's signature motif, "The Connective Line".
 *
 * A 1px Forest-Green hairline that draws itself in (scaleX 0 -> 1, from the
 * left) as it scrolls into view. It reuses the React-INDEPENDENT reveal
 * mechanism (`.reveal-init` + the vanilla `/reveal.js`, which adds `.reveal-in`),
 * so it behaves identically in every browser, degrades to a static rule with no
 * JS, and stays put under `prefers-reduced-motion`. All styling lives in the
 * `.reveal-rule` utility in globals.css; this is a plain (hook-free) component,
 * usable in server and client trees alike.
 *
 * Decorative only — rendered as an aria-hidden presentation element.
 */
export interface AnimatedRuleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay the draw-in by N ms (matches the reveal delay convention). */
  delay?: number;
}

export function AnimatedRule({
  delay = 0,
  className,
  style,
  ...props
}: AnimatedRuleProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn("reveal-rule reveal-init w-full", className)}
      style={{
        ...({ "--reveal-delay": delay ? `${delay}ms` : "0ms" } as React.CSSProperties),
        ...style,
      }}
      {...props}
    />
  );
}

export default AnimatedRule;
