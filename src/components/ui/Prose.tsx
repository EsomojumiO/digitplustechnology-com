import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

/**
 * Prose — typographic wrapper for long-form / MDX content. Establishes
 * heading and spacing rhythm and constrains to a ~65ch measure. Styles are
 * applied to child elements via descendant selectors (no Tailwind typography
 * plugin needed).
 */
export function Prose({
  as: Comp = "div",
  className,
  children,
  ...props
}: ProseProps) {
  return (
    <Comp
      className={cn(
        "measure text-body text-text",
        // vertical rhythm
        "[&>*+*]:mt-6",
        // headings
        "[&_h2]:text-h2 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-text",
        "[&_h3]:text-h3 [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-text",
        "[&_h4]:text-h4 [&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:text-text",
        // body copy
        "[&_p]:leading-relaxed [&_p]:text-text",
        "[&_strong]:font-semibold [&_strong]:text-text",
        // links
        "[&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:decoration-from-font [&_a]:underline-offset-2 hover:[&_a]:text-accent-hover",
        // lists
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:mt-2 [&_li]:marker:text-muted",
        // blockquote
        "[&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:text-muted [&_blockquote]:italic",
        // code
        "[&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-small [&_code]:font-mono",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-hairline [&_pre]:bg-surface [&_pre]:p-4 [&_pre]:text-small",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        // media & rules
        "[&_img]:rounded-lg [&_img]:border [&_img]:border-hairline",
        "[&_hr]:my-10 [&_hr]:border-hairline",
        // captions / small
        "[&_figcaption]:mt-2 [&_figcaption]:text-small [&_figcaption]:text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Prose;
