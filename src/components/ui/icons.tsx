import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * icons.tsx — the interface icon set.
 *
 * Before this existed there were 20 hand-rolled inline <svg> across 12 files,
 * drawn on four different grids (16, 18, 20, 24) with five different stroke
 * widths (1.4, 1.5, 1.75, 2). That fails the HIG outright — "all interface icons
 * in your app need to use a consistent size, level of detail, stroke thickness
 * (or weight), and perspective" — and CLAUDE.md asks for the same thing in its
 * own words ("consistent stroke widths"). See docs/DESIGN-AUDIT.md H5.
 *
 * THE INVARIANT: every icon renders at the same VISUAL stroke weight.
 *
 * That is not the same as every icon declaring the same `stroke-width`. Stroke
 * width is in user units, so 1.5 on a 16 viewBox rendered into a 16px box is
 * 1.5 device px, while 1.5 on a 24 viewBox in the same box is 1.0 — thinner, and
 * visibly so beside it. Forcing one number onto every grid is what produced the
 * mismatch in the first place.
 *
 * So the grid stays whatever each icon's geometry actually wants (an arc reads
 * badly redrawn onto a coarser grid) and the stroke is DERIVED from it:
 *
 *     strokeWidth = BASE_STROKE * (grid / BASE_GRID)
 *
 * A 16-grid icon gets 1.2, a 20-grid icon 1.5, a 24-grid icon 1.8 — and all
 * three land on the same optical weight at the same rendered size. Add an icon
 * on any grid and it matches without anyone having to do the arithmetic.
 *
 * Measured on the rendered pages after this landed, which is the only proof
 * that counts: at a 14px box every grid resolves to a 1.05px stroke, at 16px
 * every grid resolves to 1.2px, at 18px every grid resolves to 1.35px. Grid no
 * longer has any effect on appearance. Stroke still scales with rendered size,
 * which is correct — a larger icon carries a proportionally heavier stroke, the
 * same way a symbol family scales with point size.
 *
 * Brand marks (LinkedIn, X) are deliberately NOT here. They are logotypes with
 * fixed official geometry, not interface icons, and normalising them would be
 * wrong.
 */

/** Reference grid and the stroke weight defined on it. */
const BASE_GRID = 20;
const BASE_STROKE = 1.5;

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "viewBox"> {
  /** Native viewBox size this icon's path was drawn on. */
  grid?: number;
  /** Rendered box in px. Call sites may override with a className instead. */
  size?: number;
}

/**
 * Shared chrome: the derived stroke, round caps and joins, currentColor, and
 * `aria-hidden` by default — an interface icon here is always decorative beside
 * a real label, and the two call sites that are not pass their own aria props.
 */
function Icon({
  grid = BASE_GRID,
  size = 16,
  className,
  children,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox={`0 0 ${grid} ${grid}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={BASE_STROKE * (grid / BASE_GRID)}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export type { IconProps };

/* ---------------------------------------------------------------------------
   Navigation and direction
   --------------------------------------------------------------------------- */

/** Horizontal arrow. The "read on" affordance on cards and links. */
export const ArrowRight = (p: IconProps) => (
  <Icon grid={18} {...p}>
    <path d="M4 9h10M10 5l4 4-4 4" />
  </Icon>
);

export const ChevronRight = (p: IconProps) => (
  <Icon grid={16} {...p}>
    <path d="M6 4l4 4-4 4" />
  </Icon>
);

export const ChevronDown = (p: IconProps) => (
  <Icon grid={20} {...p}>
    <path d="M6 8l4 4 4-4" />
  </Icon>
);

/** Diagonal arrow, for links that leave the site. */
export const ExternalArrow = (p: IconProps) => (
  <Icon grid={16} {...p}>
    <path d="M6 3h7v7M13 3l-8 8" />
  </Icon>
);

/* ---------------------------------------------------------------------------
   Controls
   --------------------------------------------------------------------------- */

export const Menu = (p: IconProps) => (
  <Icon grid={24} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const Close = (p: IconProps) => (
  <Icon grid={24} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const Search = (p: IconProps) => (
  <Icon grid={24} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);

export const Play = (p: IconProps) => (
  <Icon grid={20} {...p}>
    <path d="M6.5 4.5l9 5.5-9 5.5V4.5z" />
  </Icon>
);

export const Pause = (p: IconProps) => (
  <Icon grid={20} {...p}>
    <path d="M7.5 4.5v11M12.5 4.5v11" />
  </Icon>
);

/* ---------------------------------------------------------------------------
   Contact and status
   --------------------------------------------------------------------------- */

export const Phone = (p: IconProps) => (
  <Icon grid={20} {...p}>
    <path d="M6.5 3.5 4 4c-.7 2 .3 5.2 3 8s6 3.7 8 3l.5-2.5-3-1.5-1.4 1.4c-1.2-.6-2.3-1.7-2.9-2.9L9.6 5.5 6.5 3.5Z" />
  </Icon>
);

export const LinkIcon = (p: IconProps) => (
  <Icon grid={24} {...p}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Icon>
);

export const Check = (p: IconProps) => (
  <Icon grid={20} {...p}>
    <path d="M4 10.5l3.5 3.5L16 6" />
  </Icon>
);

export const Warning = (p: IconProps) => (
  <Icon grid={20} {...p}>
    <path d="M10 6.5v4M10 13.5h.01M10 2.5L1.5 17h17L10 2.5z" />
  </Icon>
);
