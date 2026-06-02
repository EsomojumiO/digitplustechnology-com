"use client";

import * as React from "react";
import { useReveal, revealStyle } from "./Reveal";

/* ---------------------------------------------------------------------------
   Scroll-reveal primitives — CSS `data-reveal` driven (see Reveal.tsx).
   Content is VISIBLE without JS; the fade+rise only plays when JS is alive and
   the element enters the viewport. Above-the-fold elements reveal immediately.
   These are server-renderable-friendly client islands with stable APIs.
   --------------------------------------------------------------------------- */

export interface FadeInProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  /** Translate distance in px before reveal. */
  y?: number;
  /** Delay in ms (number) — kept as a small convenience. */
  delay?: number;
}

export function FadeIn({
  as: Comp = "div",
  y = 16,
  delay = 0,
  className,
  style,
  children,
  ...props
}: FadeInProps) {
  const ref = useReveal<HTMLElement>(true);
  return (
    <Comp
      ref={ref}
      data-reveal="hidden"
      className={className}
      style={revealStyle(y, delay, style)}
      {...props}
    >
      {children}
    </Comp>
  );
}

/**
 * Stagger — passthrough container for a group of <StaggerItem>s. Each item
 * reveals itself as it enters view (naturally staggering on scroll), so there is
 * no parent orchestration that could leave content hidden.
 */
export interface StaggerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function Stagger({
  as: Comp = "div",
  className,
  children,
  ...props
}: StaggerProps) {
  return (
    <Comp className={className} {...props}>
      {children}
    </Comp>
  );
}

export interface StaggerItemProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  /** Translate distance in px before reveal. */
  y?: number;
  /** Delay in ms. */
  delay?: number;
}

export function StaggerItem({
  as: Comp = "div",
  y = 16,
  delay = 0,
  className,
  style,
  children,
  ...props
}: StaggerItemProps) {
  const ref = useReveal<HTMLElement>(true);
  return (
    <Comp
      ref={ref}
      data-reveal="hidden"
      className={className}
      style={revealStyle(y, delay, style)}
      {...props}
    >
      {children}
    </Comp>
  );
}
