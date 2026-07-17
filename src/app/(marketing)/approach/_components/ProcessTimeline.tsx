"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Stagger, StaggerItem } from "@/components/motion";
import type { ProcessStepContent } from "@/data/types";

export interface ProcessTimelineProps {
  steps: ProcessStepContent[];
}

/**
 * ProcessTimeline, the signature treatment for the Approach page.
 *
 * The six delivery steps sit along a single vertical spine. As the section
 * scrolls into view, an Ember-Red progress line draws down the spine (scroll
 * linked), each numbered node lights up, and the step cards stagger into view
 * via the shared <Stagger>/<StaggerItem> primitives.
 *
 * Accessibility / reduced motion:
 *  - The steps are an ordered list (role="list" / "listitem" so the motion
 *    wrappers keep list semantics). Content is always present in the DOM
 *    (crawlable, no-JS friendly, the primitives never hide content without JS).
 *  - The scroll-drawn accent line + drift are gated behind
 *    prefers-reduced-motion; reduced users get a static, fully-visible spine.
 */
export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const reduce = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Scroll-linked draw of the accent line as the timeline passes through view.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative">
      {/* The spine: a hairline rail with an accent line that draws on scroll. */}
      <div
        aria-hidden="true"
        className="absolute left-[1.125rem] top-2 bottom-2 w-px bg-hairline sm:left-[1.375rem]"
      >
        {!reduce ? (
          <motion.div
            className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-accent-green via-accent-green to-accent-green/30"
            style={{ scaleY: lineScale }}
          />
        ) : (
          <div className="absolute inset-x-0 top-0 h-full bg-accent-green/40" />
        )}
      </div>

      <Stagger
        role="list"
        className="relative flex flex-col gap-10 sm:gap-12"
      >
        {steps.map((step) => (
          <StaggerItem key={step.step} role="listitem" className="relative">
            <ProcessNode
              step={step.step}
              title={step.title}
              description={step.description}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function ProcessNode({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex gap-5 sm:gap-6">
      {/* Numbered node sitting on the spine, glass disc, accent numeral. */}
      <span
        aria-hidden="true"
        className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface/80 text-small font-semibold tabular-nums text-accent-green shadow-[0_0_0_4px_var(--color-background)] backdrop-blur-sm transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:border-accent-green sm:h-11 sm:w-11"
      >
        {String(step).padStart(2, "0")}
      </span>

      <div className="flex flex-col gap-1.5 pt-1">
        <h3 className="text-h4 text-text">{title}</h3>
        <p className="text-body text-muted measure">{description}</p>
      </div>
    </div>
  );
}

export default ProcessTimeline;
