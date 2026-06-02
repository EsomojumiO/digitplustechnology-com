"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps {
  children: React.ReactNode;
  /** Seconds for one full loop. */
  speed?: number;
  /** Pause the scroll on hover. */
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Marquee — slow, seamless horizontal scroll (CSS-driven, lightweight). Content
 * is duplicated for a seamless loop. Pauses on hover; halts under reduced motion
 * (content remains static and fully visible/readable). Edges are masked to fade.
 */
export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-12 pr-12",
          "motion-safe:animate-[marquee_var(--marquee-dur)_linear_infinite]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ ["--marquee-dur" as string]: `${speed}s` }}
        aria-hidden="false"
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center gap-12 pr-12",
          "motion-safe:animate-[marquee_var(--marquee-dur)_linear_infinite]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ ["--marquee-dur" as string]: `${speed}s` }}
      >
        {children}
      </div>
    </div>
  );
}

export default Marquee;
