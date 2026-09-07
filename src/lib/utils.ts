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
 * size class last, so twMerge dropped `text-accent-foreground` as a "conflict"
 * and the label fell back to inherited ink: orange fill, #1d1d1f label, 2.93:1.
 * The dark theme had the same bug with the opposite sign — its near-black label
 * was dropped, the label inherited #fafafa, and the primary CTA shipped
 * white-on-orange at ~2.35:1, exactly the failure Button.tsx's own comment
 * warned about. It was never a token problem; it was this.
 *
 * Declaring the scale as a font-size group gives it its own bucket, so a size
 * and a colour coexist and neither evicts the other. Fixing it here fixes every
 * component that calls cn(), not just Button.
 */
/**
 * ADDING A `--text-*` TOKEN? ADD ITS NAME HERE TOO. This list is not
 * documentation, it is the registration — a token that is not in it gets
 * treated as a colour again and silently evicted by any `text-<colour>` later
 * in the same `cn()` call.
 *
 * That is not hypothetical. `--text-wordmark` was added to globals.css and the
 * lockup immediately rendered at 16px instead of 17: `cn("... text-wordmark
 * ...", "text-text")` and twMerge dropped the size. The sibling `--text-stat`
 * looked fine only because <Stat> happens to build that class list as a plain
 * string, so twMerge never ran on it. Two tokens added the same way, one broken,
 * and the difference was invisible from the CSS.
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
  // Single-purpose optical sizes, deliberately off the ladder. See globals.css §3.
  "wordmark",
  "stat",
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
