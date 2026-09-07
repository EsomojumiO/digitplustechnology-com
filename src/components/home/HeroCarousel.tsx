"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { cn } from "@/lib/utils";
import { Pause, Play } from "@/components/ui/icons";

/**
 * HeroCarousel — full-bleed overlay hero. Edge-to-edge auto-rotating photos with
 * the headline ON the image over a gradient scrim.
 *
 * SCRIM-ON-LIGHT EXCEPTION: this is the ONE place on the site where text sits on
 * a darkened photo. Everywhere else photos run bright and full-colour with no
 * scrim. The conformance gate encodes that — a scrim anywhere but here is drift.
 *
 * Contrast: the overlaid text is verified per slide against the BRIGHTEST pixel
 * in its box (worst case), not an average — the scrim only guarantees the floor
 * if it's actually dark enough behind the text, and a bright image area can
 * defeat a weak scrim. See scripts/hero-contrast.mjs.
 *
 * Engine: embla (autoplay + fade + keyboard + drag). The reveal lesson applies
 * to slide one's text — it's above the fold by definition, so its entrance is
 * gated on a `mounted` flag that flips AFTER first paint, ensuring it animates
 * from the hidden state instead of appearing already-in.
 *
 * Reduced motion: no autoplay, no Ken Burns, fade duration 0 (instant swap).
 * First slide is static; the indicators still work.
 */

type Slide = {
  src: string;
  alt: string;
  eyebrow: string;
  headline: string;
  support: string;
  cta: { label: string; href: string; conversion?: boolean };
};

/* Images follow the services-over-faces policy: infrastructure and service
   context, no posed portraits (hero-engineer.jpg — the arms-folded shot — is
   deliberately absent; it's flagged for removal in the imagery pass). Copy here
   is new and logged in docs/redesign/16-copy-refinement.md for the copy audit. */
const SLIDES: Slide[] = [
  {
    src: "/images/services/managed-services.jpg",
    alt: "A network operations screen showing infrastructure monitoring",
    eyebrow: "Managed IT",
    headline: "IT that answers the phone",
    support:
      "Monitoring, patching and support for organisations that can't afford downtime.",
    cta: { label: "Explore managed IT", href: "/services/managed-services" },
  },
  {
    src: "/images/services/deployment-implementation.jpg",
    alt: "An engineer installing and configuring rack hardware",
    eyebrow: "Deployment & Implementation",
    headline: "One team, every site",
    support:
      "Supply, cabling, configuration and handover, in Abuja, Lagos and Port Harcourt.",
    cta: { label: "See how we deploy", href: "/services/deployment-implementation" },
  },
  {
    src: "/images/services/it-procurement.jpg",
    alt: "Boxed IT hardware and equipment in a stockroom",
    eyebrow: "IT Procurement",
    headline: "Genuine hardware, documented",
    support: "Authorised channels, OEM warranties, audit-ready records.",
    cta: { label: "Explore procurement", href: "/services/it-procurement" },
  },
  {
    src: "/images/services/infrastructure-solutions.jpg",
    alt: "Structured network cabling in a server room",
    eyebrow: "Infrastructure",
    headline: "Networks built once, done right",
    support:
      "Structured cabling and server rooms sized for Nigerian power realities.",
    cta: { label: "Explore infrastructure", href: "/services/infrastructure-solutions" },
  },
  {
    src: "/images/services/technology-advisory.jpg",
    alt: "An empty meeting room with a long table and glass partitions",
    eyebrow: "Technology Advisory",
    headline: "Decisions you can defend",
    support:
      "Roadmaps, budgets and vendor choices, argued from your constraints rather than a product list.",
    cta: { label: "Explore advisory", href: "/services/technology-advisory" },
  },
  {
    src: "/images/industries/logistics-manufacturing.jpg",
    alt: "Aerial view of a distribution centre with loading bays and parked trailers",
    eyebrow: "Industries",
    headline: "Eight sectors, one standard",
    support:
      "Government, banking, healthcare, energy. The same documentation and sign-off in every one.",
    cta: { label: "See every sector", href: "/industries" },
  },
  {
    src: "/images/hero/hero-datacenter.jpg",
    alt: "Data-centre racks and infrastructure",
    eyebrow: "Digitplus",
    headline: "One partner, plan to support",
    support:
      "Procurement, infrastructure, deployment and managed services, under one accountable roof.",
    // THE conversion slide — the only orange fill in the hero. Stays LAST so the
    // sequence ends on the conversion beat.
    cta: { label: "Get a proposal", href: "/contact", conversion: true },
  },
];

const DWELL = 5000;

/**
 * End state of the Ken Burns move for slide `i`. Direction alternates so two
 * consecutive slides never drift the same way. Kept well inside the scale
 * overflow so the pan can't expose a slide edge.
 */
const kenBurnsTo = (i: number) => {
  const dir = i % 2 === 0 ? 1 : -1;
  return `scale(1.055) translate(${dir * 2}%, ${dir * -1}%)`;
};

export function HeroCarousel() {
  const reduce = useReducedMotion();

  /* Plugin instances are memoised, not held in a ref.
     The ref version read `autoplay.current` DURING RENDER, which is unsafe
     under concurrent rendering — React may render a component without
     committing it, so a render pass could mutate/observe an instance that
     never reaches the DOM. It also called `Autoplay()` and `Fade()` on EVERY
     render, handing embla a fresh plugin array each time and forcing it to
     re-initialise for no reason.

     Memoised on `reduce` alone, the array identity is stable across ordinary
     renders and embla re-initialises only when the motion preference actually
     changes — which is exactly when it should. */
  const plugins = React.useMemo(
    () =>
      reduce
        ? [Fade()]
        : [
            Fade(),
            // stopOnMouseEnter was TRUE, and it made the hero look broken.
            // This section is `h-[78vh] min-h-[560px]` and full-bleed, so it is
            // most of the viewport on load — wherever a visitor happens to leave
            // the pointer is usually inside it. Autoplay then stopped on the
            // first slide and stayed there for as long as the cursor rested
            // anywhere on the hero, which is how "the homepage is just one
            // picture" happens. Verified: static for 12s with the pointer at
            // (700,450), rotating again within 12s of moving it to (5,5).
            //
            // It was there as the pause affordance for mouse users. There is now
            // an explicit pause control, so stopping the hero is deliberate
            // rather than accidental, and hovering the artwork no longer halts
            // it.
            //
            // A hover-pause scoped to just the controls row was tried and
            // removed: `mouseenter` fires correctly, but a slide change replaces
            // the progress-fill node under the pointer, React synthesises a
            // leave/enter pair from that, and `resume` restarts what `pause` had
            // just stopped. It measured as not pausing at all. The explicit
            // button is next to the dots and does the job honestly.
            Autoplay({ delay: DWELL, stopOnInteraction: false, stopOnMouseEnter: false }),
          ],
    [reduce],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: reduce ? 0 : 32, watchDrag: !reduce },
    plugins,
  );

  const [selected, setSelected] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    // Paint-from-hidden for slide one's text (above the fold by definition):
    // flip `mounted` two frames after mount so the entrance transition has a
    // hidden state to animate from, instead of rendering already-revealed.
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setMounted(true)),
    );
    return () => {
      emblaApi.off("select", onSelect);
      cancelAnimationFrame(id);
    };
  }, [emblaApi]);

  const go = React.useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      emblaApi?.scrollNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      emblaApi?.scrollPrev();
    }
  };

  // Explicit pause, owned by the visitor rather than by the pointer.
  //
  // Autoplay used to stop on hover and on focus only. Both are mouse/keyboard
  // paths: on touch there is no hover, and no focus without committing to a
  // tap, so a phone visitor got a 5-second rotation across seven slides with no
  // way out. WCAG 2.2.2 wants a real mechanism, and it is Level A.
  const [paused, setPaused] = React.useState(false);

  const pause = () => emblaApi?.plugins()?.autoplay?.stop();
  // Hover/focus-out must not restart something the visitor deliberately stopped.
  const resume = () => {
    if (!reduce && !paused) emblaApi?.plugins()?.autoplay?.play();
  };
  const togglePaused = () => {
    const next = !paused;
    setPaused(next);
    if (next) emblaApi?.plugins()?.autoplay?.stop();
    else emblaApi?.plugins()?.autoplay?.play();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="What Digitplus does"
      aria-live="off"
      onKeyDown={onKeyDown}
      onFocusCapture={pause}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) resume();
      }}
      // `isolate` is load-bearing. `relative` alone leaves this section at
      // z-index:auto — which is NOT a stacking context — so the scrim (z-1),
      // the overlay text (z-content) and the progress bars (z-raised) were
      // resolved against the ROOT stacking context and competed directly with
      // site chrome. `isolation: isolate` makes this section a stacking context
      // whatever its z-index, so those three layers order among themselves and
      // the whole hero occupies exactly one slot in the page's stacking order.
      className="relative isolate h-[78vh] min-h-[560px] w-full overflow-hidden bg-text"
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {SLIDES.map((s, i) => {
            const isActive = i === selected;
            return (
              <div
                key={s.src}
                // `isolate` so the image/scrim/text micro-ordering below is
                // contained per slide. It was relying on embla's fade plugin
                // happening to set a transform on this node — a stacking
                // context by accident, owned by a third-party plugin. Declared
                // explicitly, it no longer depends on that.
                className="relative isolate h-full min-w-0 flex-[0_0_100%]"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${SLIDES.length}: ${s.eyebrow}`}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                  style={{
                    // Ken Burns over the dwell, active slide only. 1.055 scale
                    // plus a ~2% pan that alternates direction per slide, so
                    // consecutive slides don't drift the same way and the
                    // sequence never feels mechanical. The pan stays inside the
                    // scale overflow (5.5% total, 2.75% per edge) so no slide
                    // edge is ever revealed. Settles at the end of the dwell;
                    // linear, so it never bounces back.
                    transform:
                      isActive && !reduce ? kenBurnsTo(i) : "scale(1) translate(0, 0)",
                    transition:
                      isActive && !reduce ? `transform ${DWELL}ms linear` : "none",
                  }}
                />
                {/* Scrim — bottom-left weighted. Layered: a bottom anchor
                    guarantees the text-zone floor, the diagonal shapes the rest.
                    Verified per slide against the brightest pixel behind text. */}
                {/* Scrim — bottom-left weighted. Layered: a bottom anchor
                    guarantees the text-zone floor, the diagonal shapes the rest.
                    Verified per slide against the brightest pixel behind text.

                    A mobile-specific variant was tried and reverted (2026-09-07).
                    The audit flagged that slide 1 renders near-black at 390 while
                    reading well at 1440, and blamed the scrim. Dropping the
                    diagonal and shortening the ramp on mobile moved the hero's
                    mean luminance from 47.7 to 47.9 on slide 1 and 82.7 to 83.8
                    on slide 3 — nothing — while a first attempt at it failed
                    hero-contrast on slide 5's eyebrow at 3.43:1. The scrim is not
                    what darkens slide 1: managed-services.jpg is a low-key
                    photograph and `object-cover` at 390x658 crops a shadow-heavy
                    centre slice out of it. That is an art-direction fix (a
                    brighter frame, or per-slide object-position), not a CSS one.
                    See BLOCKERS #8 and docs/DESIGN-AUDIT.md H1. */}
                <div
                  aria-hidden="true"
                  // z-[1] above the image ON PURPOSE: the <Image> carries a
                  // `transform` (Ken Burns, and scale(1) even under reduce),
                  // which establishes a stacking context and can paint the photo
                  // OVER a z-auto scrim — that's why bright image pixels bled
                  // through and failed contrast. Explicit z ordering fixes it.
                  className="absolute inset-0 z-[1]"
                  style={{
                    // Strong to ~50% up so the WHOLE text block sits on dark
                    // pixels, then fades to show the upper photo. The floor is
                    // set by the green eyebrow, not white text: green (lum ~0.42)
                    // needs bg lum ≤ ~0.05 for 4.5:1, which takes ~0.8 black over
                    // a worst-case white image pixel — so ~0.82 here. Verified
                    // per slide by scripts/hero-contrast.mjs (worst-case pixel).
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.82) 50%, rgba(0,0,0,0.34) 68%, transparent 82%), linear-gradient(to top right, rgba(0,0,0,0.45), rgba(0,0,0,0.1) 55%, transparent)",
                  }}
                />

                {/* Overlay text — bottom-left. Local layer: ordered inside the
                    isolated hero, never against the header. */}
                <div className="absolute inset-x-0 bottom-0 z-content">
                  <div className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8 sm:pb-20">
                    <div
                      className={cn(
                        "flex max-w-[46rem] flex-col items-start gap-4 transition-[opacity,transform] duration-[var(--dur-entrance)] ease-[var(--ease-out)]",
                        // Entrance from hidden — plays once `mounted` flips
                        // post-paint. Non-active slides stay hidden (they fade
                        // under the active one anyway).
                        mounted && isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-3 opacity-0",
                      )}
                    >
                      <p className="text-caption font-semibold text-hero-eyebrow">
                        {s.eyebrow}
                      </p>
                      {/* h1 (Inter Display size), not the full display scale:
                          the display size made the block ~430px tall, pushing the
                          eyebrow up into the transparent part of the scrim. h1
                          keeps the block short enough to sit entirely on dark. */}
                      {i === 0 ? (
                        <h1 className="text-h1 max-w-[18ch] text-white">
                          {s.headline}
                        </h1>
                      ) : (
                        <p className="text-h1 max-w-[18ch] font-bold tracking-[-0.02em] text-white">
                          {s.headline}
                        </p>
                      )}
                      <p className="text-body-lg max-w-[38ch] text-white/85">
                        {s.support}
                      </p>
                      <div className="mt-2">
                        {s.cta.conversion ? (
                          <Link
                            href={s.cta.href}
                            tabIndex={isActive ? 0 : -1}
                            className="inline-flex items-center rounded-lg bg-accent px-6 py-3 text-body font-semibold text-accent-foreground transition-colors duration-[var(--dur-fast)] hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          >
                            {s.cta.label}
                          </Link>
                        ) : (
                          <Link
                            href={s.cta.href}
                            tabIndex={isActive ? 0 : -1}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/60 px-6 py-3 text-body font-semibold text-white transition-colors duration-[var(--dur-fast)] hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          >
                            {s.cta.label}
                            <span aria-hidden="true">→</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bars — TOP-right. White/0.4 track, white fill; the active bar
          fills over the dwell as a timer (non-reduced), or is simply full for the
          current slide under reduced motion.
          Top, not bottom: at 390px the bottom-right bars overlapped the
          bottom-left CTA button (the CTA is ~226px and the bars ~180px — they
          can't both sit at the bottom of a narrow screen). Top-right clears the
          text column at every width. */}
      <div className="absolute right-5 top-6 z-raised flex items-center gap-1.5 sm:right-8 sm:top-8">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
            aria-current={i === selected ? "true" : undefined}
            // The visible bar is 32x4. That was also the whole target — the only
            // way to move between slides on touch, at a ninth of the 44pt HIG
            // minimum. The button is 44px tall now and the negative margin keeps
            // the row's layout height at the bar, so nothing moved on screen.
            className="relative -my-5 flex h-11 w-8 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/40">
              {i === selected ? (
                reduce || paused ? (
                  <span className="absolute inset-0 bg-white" />
                ) : (
                  <span
                    key={selected}
                    className="hero-bar-fill absolute inset-0 bg-white"
                  />
                )
              ) : null}
            </span>
          </button>
        ))}

        {/* Under reduced motion autoplay never starts, so there is nothing to
            pause and the control would be a lie. */}
        {!reduce ? (
          <button
            type="button"
            onClick={togglePaused}
            aria-pressed={paused}
            aria-label={paused ? "Resume the slideshow" : "Pause the slideshow"}
            className="relative -my-5 ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {paused ? <Play /> : <Pause />}
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default HeroCarousel;
