"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { IndustryCard } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface IndustriesFilterItem {
  slug: string;
  title: string;
  short: string;
}

export interface IndustriesFilterProps {
  industries: IndustriesFilterItem[];
}

/* Sensible groupings of the 8 sectors. Every sector belongs to exactly one
   group, and "All" keeps all 8 reachable (the default view). */
const GROUPS: { id: string; label: string; slugs: readonly string[] }[] = [
  { id: "all", label: "All", slugs: [] },
  {
    id: "public-sector",
    label: "Public Sector",
    slugs: ["government"],
  },
  {
    id: "financial-services",
    label: "Financial Services",
    slugs: ["banking-financial-services", "enterprise", "sme"],
  },
  {
    id: "healthcare-education",
    label: "Healthcare & Education",
    slugs: ["healthcare", "education"],
  },
  {
    id: "industrial",
    label: "Industrial",
    slugs: ["oil-gas-energy", "logistics-manufacturing"],
  },
];

export function IndustriesFilter({ industries }: IndustriesFilterProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState("all");

  const activeGroup = GROUPS.find((g) => g.id === active) ?? GROUPS[0];
  const visible =
    active === "all"
      ? industries
      : industries.filter((i) => activeGroup.slugs.includes(i.slug));

  return (
    <div className="mt-12">
      {/* Filter chips */}
      <div
        role="group"
        aria-label="Filter industries by sector"
        className="flex flex-wrap gap-2"
      >
        {GROUPS.map((g) => {
          const isActive = g.id === active;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActive(g.id)}
              aria-pressed={isActive}
              className={cn(
                "relative rounded-full border px-4 py-2 text-caption font-medium",
                "transition-[color,border-color,background-color] duration-[var(--dur-base)] ease-[var(--ease-out)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green",
                isActive
                  ? // GREEN, not orange: orange is conversion-only and capped at
                    // one fill per viewport — this chip put a second one on
                    // screen beside the header CTA. Green carries active states.
                    // The fill is on the BUTTON, not on a pill behind it: the
                    // old layoutId motion.span sat at -z-10, and a contrast
                    // checker cannot resolve an overlapping sibling as a
                    // background, so it read the label as white-on-#f5f5f7
                    // (1.08:1) no matter what colour the pill was. Backgrounds
                    // belong on the element that owns the text. White on
                    // Forest-500 is 7.57:1.
                    "border-transparent bg-accent-green text-accent-foreground"
                  : "border-hairline text-muted hover:border-hairline-hover hover:text-text",
              )}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* Filtered grid with smooth layout animation */}
      <motion.ul
        layout={!reduce}
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((i) => (
            <motion.li
              key={i.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <IndustryCard
                href={`/industries/${i.slug}`}
                title={i.title}
                blurb={i.short}
                className="h-full"
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

export default IndustriesFilter;
