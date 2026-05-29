import * as React from "react";
import { cn } from "@/lib/utils";

export interface ServiceCardProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  href: string;
  title: React.ReactNode;
  blurb?: React.ReactNode;
  /** Optional leading icon. */
  icon?: React.ReactNode;
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:translate-x-1"
    >
      <path d="M4 9h10M10 5l4 4-4 4" />
    </svg>
  );
}

/**
 * ServiceCard — link card with title, blurb and an arrow affordance.
 * The whole card is clickable; arrow nudges on hover.
 */
export function ServiceCard({
  href,
  title,
  blurb,
  icon,
  className,
  ...props
}: ServiceCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "group flex flex-col gap-3 rounded-lg border border-hairline bg-surface-raised p-6",
        "transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)]",
        "hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[var(--shadow-md)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle text-accent">
          {icon}
        </span>
      ) : null}
      <h3 className="text-h4 text-text">{title}</h3>
      {blurb ? <p className="text-body text-muted measure">{blurb}</p> : null}
      <span className="mt-2 inline-flex items-center gap-1.5 text-small font-medium text-accent">
        Learn more
        <ArrowIcon />
      </span>
    </a>
  );
}

export default ServiceCard;
