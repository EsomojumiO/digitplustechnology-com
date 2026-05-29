"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  /** Stagger the reveal by N ms (useful for sequenced lists). */
  delay?: number;
  /** Translate distance in px before reveal. */
  distance?: number;
  /** Only animate the first time it enters the viewport (default true). */
  once?: boolean;
}

/**
 * Reveal — lightweight scroll-reveal (fade + small translate up) driven by
 * IntersectionObserver. Fully dependency-free. Respects
 * `prefers-reduced-motion`: when reduced, content is shown immediately with no
 * transform. Content is always present in the DOM (SSR-friendly, crawlable).
 */
/** Subscribe to the user's reduced-motion preference without setState-in-effect. */
function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false, // server snapshot: assume motion is allowed
  );
}

export function Reveal({
  as: Comp = "div",
  delay = 0,
  distance = 16,
  once = true,
  className,
  style,
  children,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  const reduced = usePrefersReducedMotion();
  const enabled = !reduced;

  React.useEffect(() => {
    if (reduced) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, reduced]);

  const shown = visible || reduced;

  return (
    <Comp
      ref={ref}
      data-reveal={shown ? "visible" : "hidden"}
      className={cn(
        enabled &&
          "motion-safe:transition-[opacity,transform] motion-safe:duration-[var(--dur-slow)] motion-safe:ease-[var(--ease-out)]",
        className,
      )}
      style={{
        ...(enabled
          ? {
              opacity: shown ? 1 : 0,
              transform: shown
                ? "translateY(0)"
                : `translateY(${distance}px)`,
              transitionDelay: shown && delay ? `${delay}ms` : undefined,
              willChange: "opacity, transform",
            }
          : null),
        ...style,
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Reveal;
