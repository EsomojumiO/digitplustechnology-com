import { CircuitTraces } from "./CircuitTraces";

/**
 * HeroMotif, positions the signature circuit-trace motif as a hero backdrop.
 * Sits above the aurora glow but below hero content, masked to fade out toward
 * the bottom so it hands off cleanly to the next section. Static-first SVG (see
 * CircuitTraces) — no canvas, no client JS, safe to server-render.
 */
export function HeroMotif() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] [mask-image:radial-gradient(120%_90%_at_70%_30%,black,transparent_75%)]"
    >
      <CircuitTraces />
    </div>
  );
}

export default HeroMotif;
