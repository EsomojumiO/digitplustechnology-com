"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * SmoothScroll — global smooth scrolling via lenis.
 *
 * Renders nothing; it exists to own the lenis instance for the app's lifetime.
 *
 * Three things worth knowing:
 *
 * 1. `prefers-reduced-motion` is a hard gate, not a softening. Under reduce we
 *    never construct lenis at all, so native scroll is completely untouched —
 *    hijacked scrolling is exactly what that preference is asking us not to do.
 *
 * 2. lenis drives NATIVE scroll position rather than transforming a wrapper, so
 *    it does NOT create a containing block for `position: fixed` descendants.
 *    (That trap is real here — see docs/DECISIONS.md — it just isn't lenis's.)
 *
 * 3. It's registered on rAF and torn down on unmount, so route changes can't
 *    leak a second instance driving the same scroll.
 *
 * If this ever costs more INP than it adds in feel, delete it — the site is
 * fully usable on native scroll and nothing else depends on this component.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return;

    const lenis = new Lenis({
      // Close to native inertia — enough to feel eased, not enough to feel
      // like the page is disobeying the wheel.
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch is left native: phones already have good inertia, and smoothing
      // it is where lenis most often costs INP for no perceived gain.
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // If the user flips reduced-motion on mid-session, stop immediately.
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        cancelAnimationFrame(frame);
        lenis.destroy();
      }
    };
    query.addEventListener("change", onChange);

    return () => {
      query.removeEventListener("change", onChange);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}

export default SmoothScroll;
