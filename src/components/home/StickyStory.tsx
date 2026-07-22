import Image from "next/image";
import { processSteps } from "@/data";

/**
 * ProcessFlow (file kept as StickyStory.tsx for import stability) — the six
 * delivery steps on home.
 *
 * **Every word here is existing approved copy** (`src/data/process.ts`).
 *
 * WAS: a sticky-storytelling pin. Each step reserved `min-h-56vh` so the
 * six-step list ran ~336vh tall, and a pinned visual crossfaded through three
 * photographs as you scrolled past. The client's preview review called the
 * result too airy and the imagery cluttered, and both are the same root cause:
 * the pin only works if the list is tall enough to scroll against, so the
 * airiness wasn't a spacing choice, it was the mechanic's rent.
 *
 * NOW: a numbered rail. The number sits in its own column, a hairline runs
 * between consecutive numbers so the steps read as ONE connected flow rather
 * than six stacked blocks, and the text flows to the right of that rail. Step
 * rhythm is intra-list rhythm — deliberately tighter than section rhythm, which
 * is the exception this section needed.
 *
 * The three-image crossfade collapses to ONE still: with tight steps the list
 * is no taller than the image, so there is nothing left to pin and nothing to
 * cycle. hero-cabling (structured cabling, no people) reads as careful,
 * documented work — and it avoids a third appearance of hero-datacenter, which
 * home already shows in the hero carousel and the full-bleed scrub band.
 *
 * No client component any more: no IntersectionObserver, no framer, no state.
 * This renders on the server.
 */
export function StickyStory() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
      <ol className="flex flex-col">
        {processSteps.map((s, i) => {
          const last = i === processSteps.length - 1;
          return (
            <li key={s.step} className="grid grid-cols-[2.5rem_1fr] gap-x-5">
              {/* Number + the connecting rail. The line is the point: it turns
                  six blocks into one flow. */}
              <div className="flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline text-small font-semibold tabular-nums text-accent-green"
                >
                  {String(s.step).padStart(2, "0")}
                </span>
                {!last && (
                  <span
                    aria-hidden="true"
                    className="mt-2 w-px flex-1 bg-[var(--border-hairline)]"
                  />
                )}
              </div>

              <div className={last ? "pb-0" : "pb-10"}>
                {/* The visible number is aria-hidden, so the step index is
                    carried here for assistive tech instead of being lost. */}
                <h3 className="text-h4 text-text">
                  <span className="sr-only">{`Step ${s.step}: `}</span>
                  {s.title}
                </h3>
                <p className="text-body measure mt-2 text-muted">
                  {s.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* One still, and it DOES stick — just without the crossfade. The list is
          ~1300px against a ~500px image, so a top-aligned still would leave the
          right column empty for two thirds of the section: the same airiness,
          moved sideways. Sticky costs nothing (it is layout, not animation, so
          reduced-motion users lose nothing) and keeps the column occupied.
          Hidden below lg: on a phone it would push the steps a screen down. */}
      <div className="hidden lg:block">
        <div className="sticky top-28">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface">
            <Image
              src="/images/hero/hero-cabling.jpg"
              alt="Structured network cabling routed and dressed through a patch panel"
              fill
              sizes="(min-width: 1024px) 26rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StickyStory;
