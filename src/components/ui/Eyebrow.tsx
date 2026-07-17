import * as React from "react";
import { cn } from "@/lib/utils";

export interface EyebrowProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
  /**
   * Optional Resend-style section index (e.g. 1 -> "· 01"), rendered after the
   * label in a dimmer tone. Numbers are zero-padded to two digits.
   */
  index?: string | number;
}

/**
 * Eyebrow, small green label above a heading — the structural accent.
 * Sentence-case semibold sans in Forest-500; optional section index, rendered
 * muted rather than green-at-alpha (which failed AA on white).
 */
export function Eyebrow({
  as: Comp = "p",
  index,
  className,
  children,
  ...props
}: EyebrowProps) {
  const indexLabel =
    typeof index === "number" ? String(index).padStart(2, "0") : index;
  return (
    <Comp
      className={cn(
        // Sentence-case green signpost. The dark theme's mono/uppercase/wide-
        // tracking idiom is retired: on white it reads as shouty technical
        // chrome, not as Apple's quiet label.
        "text-caption font-semibold text-accent-green",
        className,
      )}
      {...props}
    >
      {children}
      {indexLabel != null && (
        <span className="text-muted">{" · " + indexLabel}</span>
      )}
    </Comp>
  );
}

export default Eyebrow;
