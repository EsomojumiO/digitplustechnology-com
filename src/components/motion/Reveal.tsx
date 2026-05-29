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
  const [enabled, setEnabled] = React.useState(true);

  React.useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setEnabled(false);
      setVisible(true);
      return;
    }

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
  }, [once]);

  return (
    <Comp
      ref={ref}
      data-reveal={visible ? "visible" : "hidden"}
      className={cn(
        enabled &&
          "motion-safe:transition-[opacity,transform] motion-safe:duration-[var(--dur-slow)] motion-safe:ease-[var(--ease-out)]",
        className,
      )}
      style={{
        ...(enabled
          ? {
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateY(0)"
                : `translateY(${distance}px)`,
              transitionDelay: visible && delay ? `${delay}ms` : undefined,
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
