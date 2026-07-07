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
                "relative rounded-full border px-4 py-2 font-mono text-caption font-medium uppercase tracking-[0.12em]",
                "transition-[color,border-color,background-color] duration-[var(--dur-base)] ease-[var(--ease-out)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green",
                isActive
                  ? "border-transparent text-accent-foreground"
                  : "border-hairline text-muted hover:border-hairline-hover hover:text-text",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="industry-filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-accent"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                  aria-hidden="true"
                />
              ) : null}
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
