import * as React from "react";
import { cn } from "@/lib/utils";
import { revealStyle } from "./Reveal";

/* ---------------------------------------------------------------------------
   Scroll-reveal primitives, React-INDEPENDENT (see Reveal.tsx + /reveal.js).
   Each renders a `.reveal-init` marker; the vanilla reveal script reveals it on
   scroll. Content is visible by default and can never get stuck hidden. Plain
   components (no hooks) so they work in server and client trees alike.
   --------------------------------------------------------------------------- */

export interface FadeInProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  /** Translate distance in px before reveal. */
  y?: number;
  /** Delay in ms. */
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
  return (
    <Comp
      className={cn("reveal-init", className)}
      style={revealStyle(y, delay, style)}
      {...props}
    >
      {children}
    </Comp>
  );
}

/**
 * Stagger, passthrough container for a group of <StaggerItem>s. Each item
 * reveals itself as it scrolls in (naturally staggering), so there's no parent
 * orchestration that could leave content hidden.
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
  return (
    <Comp
      className={cn("reveal-init", className)}
      style={revealStyle(y, delay, style)}
      {...props}
    >
      {children}
    </Comp>
  );
}
