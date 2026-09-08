"use client";

import * as React from "react";

/**
 * useReducedMotion — `prefers-reduced-motion: reduce`, as a hook.
 *
 * A drop-in for framer-motion's hook of the same name, and it exists for one
 * reason: framer-motion is roughly 120KB and HeroCarousel was importing the
 * whole library to ask the browser a single media query. The hero is the LCP
 * element, so that import sat directly in the above-the-fold critical path. On
 * Lighthouse's throttled mobile profile (~1.6 Mbps) the homepage was shipping
 * 910KB of JavaScript and LCP came in at 4.1s against a 2.5s "Good" threshold.
 *
 * `useSyncExternalStore` rather than useState + useEffect: a media query IS an
 * external store, and this is what the primitive is for. It also gives a proper
 * server snapshot, so SSR and first client render agree without a cascading
 * re-render — which the `react-hooks/set-state-in-effect` lint rule correctly
 * rejects the effect-based version for.
 *
 * Server and pre-hydration render return `false` (motion allowed), matching
 * framer-motion's contract, and the real value arrives on hydration. Every
 * consumer here treats `reduce` as "hold still", so the brief window before
 * hydration errs toward the animated state exactly as it did before.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

/** Lazily cached so it is never touched during SSR and never re-created per render. */
let mediaQuery: MediaQueryList | null = null;
function getMediaQuery(): MediaQueryList {
  if (!mediaQuery) mediaQuery = window.matchMedia(QUERY);
  return mediaQuery;
}

function subscribe(onStoreChange: () => void): () => void {
  const mq = getMediaQuery();
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

const getSnapshot = () => getMediaQuery().matches;
const getServerSnapshot = () => false;

export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useReducedMotion;
