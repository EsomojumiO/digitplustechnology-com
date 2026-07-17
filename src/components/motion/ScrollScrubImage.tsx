"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ScrollScrubImageProps {
  src: string;
  alt: string;
  /** Tailwind aspect class for the band. */
  aspect?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * ScrollScrubImage — a full-bleed image band that settles as it enters.
 *
 * Scrubs scale 1.05 -> 1.0 and brightness 0.92 -> 1.0 against scroll progress,
 * so the image resolves into place rather than animating on a timer. The scrub
 * finishes by the time the band is centred; past that it just sits there.
 *
 * `transform` and `filter` only, both on the element itself — no layout
 * properties, so nothing reflows while you scroll.
 *
 * Under reduced motion it renders as a plain image at its resting values. There
 * is no "gentler" version: scroll-linked motion is the thing being opted out of.
 */
export function ScrollScrubImage({
  src,
  alt,
  aspect = "aspect-[21/9]",
  className,
  priority = false,
  sizes = "100vw",
}: ScrollScrubImageProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  // start: band's top hits the viewport bottom. end: band is centred.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  const brightness = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  if (reduce) {
    return (
      <div className={cn("relative w-full overflow-hidden bg-surface", aspect, className)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden bg-surface", aspect, className)}
    >
      <motion.div style={{ scale, filter }} className="absolute inset-0 will-change-transform">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </motion.div>
    </div>
  );
}

export default ScrollScrubImage;
