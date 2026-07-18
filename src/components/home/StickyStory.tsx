"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { processSteps } from "@/data";

/**
 * StickyStory — the one sticky-storytelling moment on the site (home only).
 *
 * A pinned visual; the six delivery steps scroll past it, and the visual
 * crossfades through three photographs as you move between phases.
 *
 * **Every word here is existing approved copy** (`src/data/process.ts`), which
 * is the whole point: this is a visual treatment of content that already ships,
 * not a new section. The brief asks for "2–3 cycling text steps"; writing three
 * fresh steps would have meant inventing marketing copy, and copy is
 * zero-change on this engagement. So the *visual* cycles through three phases
 * while the text stays the six steps the client already approved. It also means
 * this replaces the old process section rather than duplicating it.
 *
 * The pin is `position: sticky`, NOT `fixed` + scroll math — a transformed
 * ancestor becomes the containing block for `fixed` descendants (the trap that
 * ate the Phase 2 preview; see docs/DECISIONS.md). `sticky` is immune, needs no
 * scroll listener, and stays on the compositor.
 *
 * Reduced motion: the visual still pins, but never crossfades — one static
 * image and the plain list. The pin stays because `position: sticky` is layout,
 * not animation; nothing moves that wouldn't move anyway when you scroll. What
 * gets dropped is the thing that actually animates.
 */

/* Three phases across the six steps: plan (1–2), deliver (3–4), sustain (5–6).
   Infrastructure/service context, no posed portraits — the sustain image was
   hero-engineer.jpg (the arms-folded portrait) until the #2 imagery pass
   removed that shot from every slot; it's now the dark ops-racks frame, which
   reads as "kept running." */
const PHASE_IMAGES = [
  { src: "/images/hero/hero-team-lagos.jpg", alt: "An IT team at work in a Lagos office" },
  { src: "/images/hero/hero-cabling.jpg", alt: "Structured network cabling" },
  { src: "/images/hero/hero-datacenter.jpg", alt: "Data-centre racks kept running" },
] as const;

const phaseFor = (index: number) => Math.min(2, Math.floor(index / 2));

export function StickyStory() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = React.useState(0);
  const stepRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  React.useEffect(() => {
    if (reduce) return;
    // Whichever step sits nearest the viewport centre drives the visual. An
    // IntersectionObserver with a centre band is steadier and cheaper than
    // redoing this arithmetic in a scroll handler every frame.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = stepRefs.current.indexOf(e.target as HTMLLIElement);
          if (i >= 0) setPhase(phaseFor(i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const el of stepRefs.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Pinned visual — lg+ only; there's no room to pin on a phone. */}
      <div className="hidden lg:block">
        <div className="sticky top-28">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface">
            {reduce ? (
              <Image
                src={PHASE_IMAGES[0].src}
                alt={PHASE_IMAGES[0].alt}
                fill
                sizes="50vw"
                className="object-cover"
              />
            ) : (
              PHASE_IMAGES.map((img, i) => (
                <motion.div
                  key={img.src}
                  aria-hidden={i !== phase}
                  initial={false}
                  animate={{ opacity: i === phase ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={img.src}
                    alt={i === phase ? img.alt : ""}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* The six steps — existing copy, unchanged. Steps are never dimmed when
          inactive: fading them to ~0.35 would put real body copy near 1.5:1,
          i.e. unreadable text used as decoration. (It would also slip past the
          conformance gate, which reads `color` and not ancestor opacity — a
          check you can walk under is worse than no check.) The pinned visual
          already carries the sense of progression. */}
      <ol className="flex flex-col">
        {processSteps.map((s, i) => (
          <li
            key={s.step}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className="flex min-h-[44vh] flex-col justify-center py-8 lg:min-h-[56vh]"
          >
            <p className="text-caption font-semibold text-accent-green">
              Step {String(s.step).padStart(2, "0")}
            </p>
            <h3 className="text-h3 mt-3 text-text">{s.title}</h3>
            <p className="text-body measure mt-3 text-muted">{s.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default StickyStory;
