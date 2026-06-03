import * as React from "react";
import { cn } from "@/lib/utils";

export interface TestimonialProps
  extends React.HTMLAttributes<HTMLElement> {
  quote: React.ReactNode;
  author: string;
  role?: string;
  organization?: string;
}

/**
 * Testimonial, quote with attribution. Uses a semantic <figure>/<blockquote>.
 */
export function Testimonial({
  quote,
  author,
  role,
  organization,
  className,
  ...props
}: TestimonialProps) {
  const attribution = [role, organization].filter(Boolean).join(", ");
  return (
    <figure
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <blockquote className="text-h3 font-medium tracking-tight text-text measure-wide">
        <span aria-hidden="true">&ldquo;</span>
        {quote}
        <span aria-hidden="true">&rdquo;</span>
      </blockquote>
      <figcaption className="flex flex-col gap-0.5">
        <span className="text-body font-semibold text-text">{author}</span>
        {attribution ? (
          <span className="text-small text-muted">{attribution}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}

export default Testimonial;
