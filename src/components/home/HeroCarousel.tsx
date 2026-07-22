"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { cn } from "@/lib/utils";

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
      "Supply, cabling, configuration and handover — Abuja, Lagos, Port Harcourt.",
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
      "Roadmaps, budgets and vendor choices, argued from your constraints — not a product list.",
    cta: { label: "Explore advisory", href: "/services/technology-advisory" },
  },
  {
    src: "/images/industries/logistics-manufacturing.jpg",
    alt: "Aerial view of a distribution centre with loading bays and parked trailers",
    eyebrow: "Industries",
    headline: "Built around how your sector works",
    support:
      "A hospital can't absorb the downtime a warehouse can. We size the work to each.",
    cta: { label: "See every sector", href: "/industries" },
  },
  {
    src: "/images/hero/hero-datacenter.jpg",
    alt: "Data-centre racks and infrastructure",
    eyebrow: "Digitplus",
    headline: "One partner, plan to support",
    support:
      "Procurement, infrastructure, deployment and managed services, from one partner.",
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
  const autoplay = React.useRef(
    Autoplay({ delay: DWELL, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  const plugins = reduce ? [Fade()] : [Fade(), autoplay.current];
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

  // Pause autoplay while any control inside the hero has focus (keyboard users).
  const pause = () => autoplay.current?.stop();
  const resume = () => {
    if (!reduce) autoplay.current?.play();
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
      className="relative h-[78vh] min-h-[560px] w-full overflow-hidden bg-[#1d1d1f]"
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {SLIDES.map((s, i) => {
            const isActive = i === selected;
            return (
              <div
                key={s.src}
                className="relative h-full min-w-0 flex-[0_0_100%]"
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

                {/* Overlay text — bottom-left */}
                <div className="absolute inset-x-0 bottom-0 z-10">
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
                      <p className="text-caption font-semibold text-[#5fbf94]">
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
      <div className="absolute right-5 top-6 z-20 flex items-center gap-1.5 sm:right-8 sm:top-8">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
            aria-current={i === selected ? "true" : undefined}
            className="relative h-1 w-8 overflow-hidden rounded-full bg-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {i === selected ? (
              reduce ? (
                <span className="absolute inset-0 bg-white" />
              ) : (
                <span
                  key={selected}
                  className="hero-bar-fill absolute inset-0 bg-white"
                />
              )
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}

export default HeroCarousel;
