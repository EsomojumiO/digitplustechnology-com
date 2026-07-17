import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui";

export interface InsightShelfCardProps {
  href: string;
  cover: string;
  coverAlt: string;
  categoryLabel: string;
  readingTime: string;
  title: string;
  excerpt: string;
}

/* Shared frosted-surface treatment for the content shelf. A hairline + soft
   translucent surface + backdrop blur, lifting gently on hover. */
const glass =
  "group relative flex flex-col overflow-hidden rounded-xl border border-hairline " +
  "bg-surface-raised/70 backdrop-blur-md " +
  "transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] " +
  "hover:-translate-y-0.5 hover:border-hairline-hover hover:shadow-[var(--shadow-md)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green";

/**
 * InsightShelfCard, a premium frosted insight card for the home content shelf.
 */
export function InsightShelfCard({
  href,
  cover,
  coverAlt,
  categoryLabel,
  readingTime,
  title,
  excerpt,
}: InsightShelfCardProps) {
  return (
    <a href={href} className={glass}>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
        <Image
          src={cover}
          alt={coverAlt}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
        {/* dark scrim so light covers seat into the near-black canvas */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent"
          aria-hidden="true"
        />
        {/* hairline seam between media and body */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-hairline" aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3 font-mono text-caption uppercase tracking-[0.1em] text-muted">
          <Badge tone="accent">{categoryLabel}</Badge>
          <span>{readingTime}</span>
        </div>
        <h3 className="text-h4 text-text">{title}</h3>
        <p className="text-small text-muted measure">{excerpt}</p>
      </div>
    </a>
  );
}

export default InsightShelfCard;
