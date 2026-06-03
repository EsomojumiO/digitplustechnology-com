/**
 * Motion tokens, single source of truth for JS-driven animation (Framer Motion),
 * mirroring the CSS duration/easing tokens in globals.css.
 */
export const DUR = {
  fast: 0.15,
  base: 0.22,
  slow: 0.32,
} as const;

/** Signature entrance easing, matches --ease-out: cubic-bezier(0.22,1,0.36,1). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Springy curve for interactive/magnetic elements. */
export const SPRING = { type: "spring", stiffness: 220, damping: 22, mass: 0.6 } as const;

/** Standard stagger between grouped children. */
export const STAGGER = 0.07;
