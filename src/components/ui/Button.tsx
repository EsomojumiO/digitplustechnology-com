import * as React from "react";
import { Link } from "next-view-transitions";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

// `whitespace-nowrap` used to sit in this string. At a 200% user text size a
// nowrap label ("Send your brief") took a min-content width of 576px, and a
// grid item with the default `min-width: auto` cannot shrink below its
// min-content — so the contact column resolved to 576px inside a 310px
// container and the document scrolled sideways (616 vs 390). Labels wrap now.
const base =
  "inline-flex items-center justify-center gap-2 font-display font-semibold tracking-[-0.01em] select-none text-center " +
  "rounded-lg transition-[background-color,color,box-shadow,transform,border-color,filter] " +
  "duration-[var(--dur-fast)] ease-[var(--ease-out)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green " +
  "active:translate-y-px active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  // 1. PRIMARY — orange fill (Ember-600), WHITE label at 5.74:1. Max ONE per
  //    viewport. Hover DARKENS to Ember-700 (the light-canvas idiom) instead of
  //    brightening. The inner white glow + orange drop-glow are gone: glows are
  //    banned on white, and depth here comes from the fill alone.
  primary: "bg-accent text-accent-foreground hover:bg-accent-hover",
  // 2. SECONDARY — no fill, #d2d2d7 hairline pill, near-black label. The border
  //    DARKENS on hover rather than brightening.
  secondary:
    "bg-transparent text-text border border-hairline hover:border-hairline-hover",
  // 3. GHOST / LINK — green text, animated underline. Sits inline as a link
  //    (size padding/height are skipped below) so the underline hugs the label.
  //    Skipping the height left a ~20px-tall target, so a transparent 44px band
  //    is projected behind the label. It costs no layout and does not move the
  //    underline, which is drawn on the element's own background.
  ghost:
    "relative bg-transparent text-accent-green link-underline hover:text-accent-green " +
    "before:absolute before:inset-x-0 before:top-1/2 before:h-11 before:-translate-y-1/2 before:content-['']",
};

// Sizes tuned to the client's button spec: primary CTAs land at 15–16px.
// `md` was `text-[15px]`. A hard px value ignores the reader's font-size
// setting, so at 200% text the CTA label stayed 15px next to 26px body copy —
// the smallest type on the page. It is a ladder step now.
const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-small sm:min-h-9 sm:py-0",
  md: "min-h-11 px-6 py-2.5 text-body",
  lg: "min-h-12 px-6 py-3 text-body",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Button, primary | secondary | ghost; sizes sm | md | lg.
 * Renders an <a> when `href` is provided, otherwise a <button>.
 */
export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  { variant = "primary", size = "md", className, children, ...props },
  ref,
) {
  // Ghost renders as an inline link, so it opts out of the box sizing.
  const classes = cn(
    base,
    variants[variant],
    variant === "ghost" ? "gap-1" : sizes[size],
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    // Internal links route through next-view-transitions, the same Link the
    // article cards already use. As a raw <a> every CTA on the site was a full
    // document reload that skipped the App Router and the 220ms view
    // transition, so a service card white-flashed while an article crossfaded.
    // mailto:, tel: and absolute URLs stay raw anchors.
    const internal = href.startsWith("/") || href.startsWith("#");
    if (internal) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...rest}
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const { type, ...rest } = props as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type ?? "button"}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
