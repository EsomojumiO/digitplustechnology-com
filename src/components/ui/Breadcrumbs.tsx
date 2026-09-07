import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "./icons";

export interface BreadcrumbItem {
  label: string;
  /** Omit href on the current (last) page. */
  href?: string;
}

export interface BreadcrumbsProps
  extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}


/**
 * Breadcrumbs, accessible trail. Renders an ordered list inside a labelled
 * <nav>; the current page is marked with aria-current. Visual only
 * (JSON-LD is handled separately by the SEO layer).
 */
export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-small", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="rounded-sm text-muted transition-colors duration-[var(--dur-fast)] hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className="font-medium text-text"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronRight size={14} className="text-muted" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
