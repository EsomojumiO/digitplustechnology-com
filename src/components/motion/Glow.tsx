import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Glow — the core "Raycast" ambient ingredient: a large, soft radial of the
 * accent colours sitting BEHIND key content (hero, section heads) at low
 * opacity. The softness comes from the radial gradient itself, so there is NO
 * runtime `filter: blur()` — it's compositor-cheap and never animates filter.
 *
 * Decorative + non-interactive (aria-hidden). Position/size it with utility
 * classes on `className` (it's absolutely positioned by the `.glow` utility);
 * pass `tone="orange"` for the warm variant. Plain hook-free component, usable
 * in server and client trees alike.
 */
export interface GlowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accent hue. Green (structural) by default; orange for warmth. */
  tone?: "green" | "orange";
}

export function Glow({ tone = "green", className, ...props }: GlowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("glow", tone === "orange" && "glow-orange", className)}
      {...props}
    />
  );
}

export default Glow;
