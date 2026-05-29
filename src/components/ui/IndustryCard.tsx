import * as React from "react";
import { cn } from "@/lib/utils";

export interface IndustryCardProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  href: string;
  title: React.ReactNode;
  blurb?: React.ReactNode;
  icon?: React.ReactNode;
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-muted transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:text-accent"
    >
      <path d="M4 9h10M10 5l4 4-4 4" />
    </svg>
  );
}

/**
 * IndustryCard — compact link card for a sector, with title, blurb and arrow.
 */
export function IndustryCard({
  href,
  title,
  blurb,
  icon,
  className,
  ...props
}: IndustryCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "group flex items-start gap-4 rounded-lg border border-hairline bg-surface-raised p-5",
        "transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)]",
        "hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[var(--shadow-md)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-subtle text-accent">
          {icon}
        </span>
      ) : null}
      <span className="flex flex-1 flex-col gap-1">
        <span className="text-h4 text-text">{title}</span>
        {blurb ? <span className="text-small text-muted">{blurb}</span> : null}
      </span>
      <span className="pt-1.5">
        <ArrowIcon />
      </span>
    </a>
  );
}

export default IndustryCard;
