"use client";

import dynamic from "next/dynamic";

// Lazy, client-only: the canvas motif is never in the initial/SSR payload. Until
// it loads, the hero's aurora layer is the handsome fallback (and remains beneath).
const NetworkField = dynamic(
  () => import("./NetworkField").then((m) => m.NetworkField),
  { ssr: false },
);

/**
 * HeroMotif — positions the signature network motif as a hero backdrop. Sits
 * above the aurora glow but below hero content. Masked to fade out toward the
 * bottom so it hands off cleanly to the next section.
 */
export function HeroMotif({ density }: { density?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] opacity-70 [mask-image:radial-gradient(120%_90%_at_70%_30%,black,transparent_75%)]"
    >
      <NetworkField density={density} />
    </div>
  );
}

export default HeroMotif;
