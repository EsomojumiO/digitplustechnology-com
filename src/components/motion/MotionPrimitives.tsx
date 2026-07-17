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
  y = 20,
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
 * Stagger, container that gives each descendant <StaggerItem> an incrementing
 * reveal delay so siblings enter in sequence rather than all at once.
 *
 * This used to be a bare passthrough — which meant the "stagger" was a lie: every
 * StaggerItem defaulted to delay 0, so a grid row revealed simultaneously (all
 * six service cards measured transitionDelay: 0s). The name promised a sweep the
 * code never delivered.
 *
 * It walks the subtree (StaggerItems usually sit inside a <Grid>, not as direct
 * children) and assigns `index * step` — capped by a modulo so a 33-item list
 * can't accumulate a multi-second lag; the sweep repeats per visual group
 * instead. Still hook-free, so it stays usable in server trees, and it never
 * hides anything: it only sets a delay on an element that reveals itself.
 */
export interface StaggerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  /** Per-sibling delay in ms. */
  step?: number;
  /** Delays repeat every `groupSize` items so long lists don't drag. */
  groupSize?: number;
}

export function Stagger({
  as: Comp = "div",
  step = 70,
  groupSize = 5,
  className,
  children,
  ...props
}: StaggerProps) {
  let index = 0;
  const walk = (nodes: React.ReactNode): React.ReactNode =>
    React.Children.map(nodes, (child) => {
      if (!React.isValidElement(child)) return child;
      if (child.type === StaggerItem) {
        const own = (child.props as StaggerItemProps).delay ?? 0;
        const delay = own + (index % groupSize) * step;
        index += 1;
        return React.cloneElement(child, { delay } as Partial<StaggerItemProps>);
      }
      const kids = (child.props as { children?: React.ReactNode }).children;
      if (kids) {
        return React.cloneElement(
          child,
          {} as never,
          walk(kids),
        );
      }
      return child;
    });

  return (
    <Comp className={className} {...props}>
      {walk(children)}
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
  y = 20,
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
