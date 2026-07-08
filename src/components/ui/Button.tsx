import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-display font-semibold tracking-[-0.01em] whitespace-nowrap select-none " +
  "rounded-lg transition-[background-color,color,box-shadow,transform,border-color,filter] " +
  "duration-[var(--dur-fast)] ease-[var(--ease-out)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green " +
  "active:translate-y-px active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    // Orange fill, dark label; subtle inner glow + slight brighten on hover.
    "bg-accent text-accent-foreground shadow-[var(--shadow-sm)] hover:bg-accent-hover " +
    "hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.25),0_6px_22px_-8px_color-mix(in_oklab,var(--accent)_70%,transparent)]",
  secondary:
    "bg-surface-raised text-text border border-hairline hover:bg-surface shadow-[var(--shadow-sm)]",
  ghost: "bg-transparent text-text hover:bg-surface",
};

// Sizes tuned to the client's button spec: primary CTAs land at 15–16px.
const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-small",
  md: "h-11 px-6 text-[15px]",
  lg: "h-12 px-6 text-body",
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
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
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
