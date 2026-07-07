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
 * Eyebrow, small uppercase mono label above a heading. Green structural accent
 * on the dark canvas; optional "· 01" section index in the Resend manner.
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
        // Monospace technical label, restrained-futurism precision signal.
        "font-mono text-caption font-medium uppercase tracking-[0.18em] text-accent-green",
        className,
      )}
      {...props}
    >
      {children}
      {indexLabel != null && (
        <span className="text-accent-green/50">{" · " + indexLabel}</span>
      )}
    </Comp>
  );
}

export default Eyebrow;
