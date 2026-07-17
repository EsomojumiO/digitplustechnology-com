"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * HeroCarousel — full-height crossfade carousel for the home hero image zone.
 *
 * Crossfade + slow Ken Burns (no sliding). One image at a time, edge-to-edge,
 * rounded-3xl, no frame, photo full-colour. Caption (green eyebrow +
 * one line) is a named link to the service; 5 hairline progress bars double as
 * the dwell timer (fill orange->green). Pauses on hover/focus; arrow keys when
 * focused; reduced-motion → static first slide, indicators still clickable.
 *
 * Interim stock imagery — swap the client's dedicated photos by editing SLIDES.
 */
const SLIDES = [
  {
    src: "/images/hero/hero-team-lagos.jpg",
    eyebrow: "Managed IT · 01",
    caption: "IT teams that run yours",
    href: "/services/managed-services",
    alt: "Managed IT services",
  },
  {
    src: "/images/hero/hero-datacenter.jpg",
    eyebrow: "Data centre · 02",
    caption: "Infrastructure, kept alive",
    href: "/services/hardware-supply",
    alt: "Data-centre hardware supply",
  },
  {
    src: "/images/hero/hero-cabling.jpg",
    eyebrow: "Networking · 03",
    caption: "Structured cabling, done once",
    href: "/services/infrastructure-solutions",
    alt: "Infrastructure and networking",
  },
  {
    src: "/images/hero/hero-engineer.jpg",
    eyebrow: "Support · 04",
    caption: "Engineers on call, nationwide",
    href: "/services/deployment-implementation",
    alt: "Deployment and support engineers",
  },
  {
    src: "/images/hero/hero-enterprise-user.jpg",
    eyebrow: "Workplace · 05",
    caption: "Devices your people rely on",
    href: "/industries/enterprise",
    alt: "Enterprise workplace",
  },
] as const;

const DWELL = 6000;

export function HeroCarousel() {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const go = React.useCallback(
    (i: number) => setActive((i + SLIDES.length) % SLIDES.length),
    [],
  );

  // Auto-rotation — disabled under reduced motion or while paused.
  React.useEffect(() => {
    if (reduce || paused) return;
    const t = setTimeout(
      () => setActive((a) => (a + 1) % SLIDES.length),
      DWELL,
    );
    return () => clearTimeout(t);
  }, [active, paused, reduce]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    }
  };

  const current = SLIDES[active];

  return (
    <div
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="What we do"
      aria-live="off"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node))
          setPaused(false);
      }}
      // White surround, no border, larger radius: on white the photo needs no
      // frame to sit in the page — the hairline was there to separate it from
      // near-black.
      // 4:3 on phones (portrait-ish reads better in a narrow column), 16:9 from
      // sm up now that it spans the full container rather than a 7-of-12 slot.
      className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-surface sm:aspect-[16/9]"
    >
      {SLIDES.map((s, i) => {
        const isActive = i === active;
        return (
          <div
            key={s.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${SLIDES.length}`}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 transition-opacity duration-[900ms] ease-[var(--ease-out)]",
              isActive ? "z-10 opacity-100" : "z-0 opacity-0",
            )}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
              style={{
                // Ken Burns: softened to 1.03 — 1.06 reads as a zoom, not drift.
                transform: isActive && !reduce ? "scale(1.03)" : "scale(1)",
                transition: isActive && !reduce ? "transform 6000ms linear" : "none",
              }}
            />
            {/* Soft WHITE gradient at the image base, sized to the caption. The
                dark theme veiled the whole frame in near-black; on white the
                photo runs full-colour and only the caption zone is lifted. */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/70 to-transparent"
              aria-hidden="true"
            />
          </div>
        );
      })}

      {/* Caption — crossfades with the slide, links to the service */}
      <Link
        href={current.href}
        className="absolute bottom-4 left-4 z-20 max-w-[80%] rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
      >
        <span className="text-caption block font-semibold text-accent-green">
          {current.eyebrow}
        </span>
        <span className="mt-1 block font-display text-h4 font-semibold text-text">
          {current.caption}
        </span>
      </Link>

      {/* Progress bars (bottom-right) — click to jump; active bar is the timer */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show slide ${i + 1}: ${s.caption}`}
            aria-current={i === active ? "true" : undefined}
            className="relative h-1 w-7 overflow-hidden rounded-full bg-hairline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
          >
            {i === active ? (
              <span
                key={active}
                className="hero-progress-fill absolute inset-0"
                style={{ animationPlayState: paused ? "paused" : "running" }}
              />
            ) : i < active ? (
              <span className="absolute inset-0 bg-[color-mix(in_oklab,var(--accent-green)_55%,transparent)]" />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
