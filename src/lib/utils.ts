import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The project's typographic scale is a set of custom `.text-*` component classes
 * (globals.css §5): text-display, text-h1..h4, text-body, text-body-lg,
 * text-small, text-caption. tailwind-merge has no way to know these are FONT
 * SIZES — it sees `text-body`, assumes `text-<color>`, and treats it as
 * conflicting with a real colour utility like `text-accent-foreground`.
 *
 * That silently broke every Button. `cn(base, variants[v], sizes[s])` puts the
 * size class LAST, so `text-accent-foreground` was evicted as a "conflict" and
 * the label fell back to the inherited body colour — `--text`, i.e. #fafafa.
 * So the primary CTA has been shipping WHITE on orange at ~2.35:1: precisely
 * the failure Button.tsx's own comment warns about ("White-on-orange fails
 * WCAG (~2.2:1); the dark label lands ~8.6:1"). The comment documented an
 * intent the code never delivered, on every button on the site.
 *
 * With the scale declared as its own font-size group, a size and a colour can
 * coexist and neither evicts the other, so `--accent-foreground` (#060707)
 * actually reaches the label and lands the ~8.6:1 the design always intended.
 *
 * Found on redesign/apple-light (where the same bug surfaced with the opposite
 * sign — the label inherited ink and gave 2.93:1 on the light canvas) and
 * backported here so the fallback isn't carrying a known contrast defect.
 * Fixing it in cn() fixes every caller, not just Button.
 */
const TYPE_SCALE = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "body",
  "body-lg",
  "small",
  "caption",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: TYPE_SCALE }],
    },
  },
});

/**
 * Merge class names with conflict resolution.
 * Combines clsx (conditional join) with tailwind-merge (dedupe conflicting
 * Tailwind utilities so the last one wins).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
