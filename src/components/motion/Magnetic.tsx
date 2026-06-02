"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export interface MagneticProps {
  children: React.ReactNode;
  /** Max px the element drifts toward the cursor. */
  strength?: number;
  className?: string;
}

/**
 * Magnetic — wraps an interactive element so it subtly drifts toward the cursor
 * (a "magnetic" pull), settling back via spring on leave. Disabled under reduced
 * motion and on touch (no hover). Inline-block so it hugs its child.
 */
export function Magnetic({ children, strength = 6, className }: MagneticProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.6 });

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const relX = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const relY = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

export default Magnetic;
