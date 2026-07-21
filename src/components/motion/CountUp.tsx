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
 * Layout effects don't run on the server, so fall back to useEffect there to
 * avoid an SSR warning. On the client this is a real layout effect: it commits
 * BEFORE first paint, which is what lets us swap in the 0 start frame without
 * the final value ever being visible.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * CountUp, animates a figure from 0 to `value` when scrolled into view.
 *
 * The SERVER render is the final value, not 0. This was `useState(0)`, which
 * meant the shipped HTML — and so crawlers, no-JS visitors and first paint —
 * read "0 Industries served / 0 Service lines / 0 Cities served" on the home
 * stats band and "0+ Enterprise clients" on /about. The previous docstring
 * asserted that SSR showed the final value; it never did.
 *
 * So: render `value`, and drop to 0 only on the client, in a layout effect
 * (before paint, so no flash of the final figure), and only when we are
 * actually going to animate. Under reduced motion we never touch it — the
 * final value simply stands, which is also the correct no-JS outcome.
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
  const [display, setDisplay] = React.useState(value);
  // Set once the client has committed the 0 start frame. Guards the animation
  // so it can never run against a server-rendered value.
  const armed = React.useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (reduce || armed.current) return;
    armed.current = true;
    setDisplay(0);
  }, [reduce]);

  React.useEffect(() => {
    if (!inView || reduce || !armed.current) return;
    const controls = animate(0, value, {
      duration,
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
