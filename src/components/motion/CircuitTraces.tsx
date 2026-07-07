import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CircuitTraces — the hero background motif (replaces the old NetworkField dots).
 *
 * Static-first: 3 thin PCB-style traces (long runs + right-angle turns) drawn in
 * faint green. A brighter green pulse travels each path via `stroke-dashoffset`
 * animation (compositor-cheap, no canvas, no JS). Staggered so the three feel
 * alive without being busy. Ties to the "Connective Line" story.
 *
 * Pure SVG + CSS — server-renderable, no "use client". Decorative (aria-hidden).
 * Under `prefers-reduced-motion` the pulses are hidden and the static traces
 * remain (see `.circuit-pulse` in globals.css).
 */
const TRACES = [
  "M0 118 H320 V300 H560 V180 H860 V430 H1200",
  "M0 486 H180 V360 H430 V520 H760 V300 H1040 V440 H1200",
  "M1200 88 H900 V244 H620 V120 H300 V330 H0",
] as const;

const DELAYS = ["0s", "3s", "6s"] as const;

export function CircuitTraces({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-full w-full", className)}
      viewBox="0 0 1200 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <g
        stroke="var(--accent-green)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {TRACES.map((d, i) => (
          <React.Fragment key={i}>
            {/* faint base trace */}
            <path d={d} opacity="0.1" />
            {/* travelling bright pulse */}
            <path
              d={d}
              pathLength={100}
              className="circuit-pulse"
              style={{ "--pulse-delay": DELAYS[i] } as React.CSSProperties}
            />
          </React.Fragment>
        ))}
      </g>
    </svg>
  );
}

export default CircuitTraces;
