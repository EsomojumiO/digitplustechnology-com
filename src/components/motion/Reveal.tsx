"use client";

import * as React from "react";

/**
 * useReveal — reveals an element on scroll via a CSS `data-reveal` attribute.
 *
 * Robustness (this is the important part):
 * - The element is only hidden when `html.reveal-ready` is set (a pre-paint
 *   script in the root layout). With no JS / a hydration failure, content stays
 *   visible — it can never get stuck invisible.
 * - On mount we IMMEDIATELY reveal anything already in the viewport (no waiting
 *   on an IntersectionObserver callback), so above-the-fold headings show at once.
 * - Below-the-fold elements reveal as they scroll in. No React state is used, so
 *   there's no setState-in-effect and no re-render fighting the DOM attribute.
 */
export function useReveal<T extends HTMLElement>(once = true) {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reveal = () => node.setAttribute("data-reveal", "visible");

    // No IntersectionObserver support → just show it.
    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    // Already on screen at mount → reveal now (don't wait for a scroll/callback).
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-reveal", "visible");
            if (once) io.unobserve(e.target);
          } else if (!once) {
            e.target.setAttribute("data-reveal", "hidden");
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [once]);

  return ref;
}

function revealStyle(
  distance: number,
  delay: number,
  style?: React.CSSProperties,
): React.CSSProperties {
  return {
    ...({
      "--reveal-distance": `${distance}px`,
      "--reveal-delay": delay ? `${delay}ms` : "0ms",
    } as React.CSSProperties),
    ...style,
  };
}

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  /** Stagger the reveal by N ms. */
  delay?: number;
  /** Translate distance in px before reveal. */
  distance?: number;
  /** Re-hide when scrolled out of view (default false = reveal once). */
  once?: boolean;
}

/**
 * Reveal — scroll-reveal wrapper (fade + small rise). Content is visible without
 * JS; the rise/fade only plays when JS is alive and the element scrolls in.
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
  const ref = useReveal<HTMLElement>(once);
  return (
    <Comp
      ref={ref}
      data-reveal="hidden"
      className={className}
      style={revealStyle(distance, delay, style)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { revealStyle };
export default Reveal;
