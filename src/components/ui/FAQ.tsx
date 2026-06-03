"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: React.ReactNode;
  answer: React.ReactNode;
}

export interface FAQProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FAQItem[];
  /** Allow more than one item open at a time. */
  allowMultiple?: boolean;
  /** Index of an item open on mount. */
  defaultOpen?: number;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "shrink-0 text-muted transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)]",
        open && "rotate-180",
      )}
    >
      <path d="M6 8l4 4 4-4" />
    </svg>
  );
}

/**
 * FAQ, accessible disclosure list. Each row is a <button> toggling an answer
 * region with aria-expanded / aria-controls. Keyboard accessible by default.
 */
export function FAQ({
  items,
  allowMultiple = false,
  defaultOpen,
  className,
  ...props
}: FAQProps) {
  const baseId = React.useId();
  const [open, setOpen] = React.useState<Set<number>>(
    () => new Set(defaultOpen !== undefined ? [defaultOpen] : []),
  );

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  return (
    <div
      className={cn("divide-y divide-hairline border-y border-hairline", className)}
      {...props}
    >
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const btnId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={i}>
            <h3 className="m-0">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-body-lg font-medium text-text transition-colors duration-[var(--dur-fast)] hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span>{item.question}</span>
                <ChevronIcon open={isOpen} />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="pb-5 text-body text-muted measure"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FAQ;
