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
 * Eyebrow, the small label above a section heading — a PILL as of the client's
 * preview review: label inside a rounded-full hairline border, green text,
 * 12-13px, comfortable padding. It replaces the old thin-rule-above idiom,
 * which read as decoration rather than as a label and needed a second element
 * (AnimatedRule) to carry it.
 *
 * One component, no per-page variants. Inline-flex so the border hugs the text
 * and the pill stays centred inside SectionHeading's centred column.
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
        // 0.8125rem (13px) rather than --text-caption (12px): inside a bordered
        // pill the label needs to stay legible, and 12px semibold in green on
        // white starts to look like fine print.
        "inline-flex w-fit items-center rounded-full border border-hairline",
        "px-3 py-1 text-[0.8125rem] font-semibold leading-none text-accent-green",
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
