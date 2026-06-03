"use client";

import * as React from "react";
import {
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion";

export interface CountUpProps {
  /** Target number to count to. */
  value: number;
  /** Text rendered after the number, e.g. "+". */
  suffix?: string;
  /** Text rendered before the number. */
  prefix?: string;
  /** Animation duration in seconds. */
  duration?: number;
  className?: string;
}

/**
 * CountUp, animates a figure from 0 to `value` when scrolled into view.
 * Reduced motion (or no-JS via SSR text) shows the final value immediately.
 */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1.4,
  className,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    // Reduced motion → duration 0 jumps straight to the value. setState only ever
    // happens inside the onUpdate callback, never synchronously in the effect body.
    const controls = animate(0, value, {
      duration: reduce ? 0 : duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default CountUp;
