"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";
import { DUR, EASE_OUT, STAGGER } from "./tokens";

/* ---------------------------------------------------------------------------
   FadeIn — scroll-reveal (opacity + small translate) on first view.
   Reduced motion → instant fade only (no translate).
   --------------------------------------------------------------------------- */
export interface FadeInProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  /** Translate distance in px before reveal. */
  y?: number;
  /** Delay in seconds. */
  delay?: number;
  as?: keyof typeof motion;
}

export function FadeIn({
  y = 16,
  delay = 0,
  children,
  ...props
}: FadeInProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: DUR.slow, ease: EASE_OUT, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
   Stagger — container that staggers its <StaggerItem> children into view.
   --------------------------------------------------------------------------- */
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER } },
};

export function Stagger({
  children,
  ...props
}: Omit<HTMLMotionProps<"div">, "ref">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={containerVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  y = 16,
  children,
  ...props
}: Omit<HTMLMotionProps<"div">, "ref"> & { y?: number }) {
  const reduce = useReducedMotion();
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE_OUT } },
  };
  return (
    <motion.div variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}
