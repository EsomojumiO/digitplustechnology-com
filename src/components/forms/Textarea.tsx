"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { controlBase } from "./controls";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Textarea, token-styled multiline input. Pair with <Field>. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, rows = 5, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(controlBase, "resize-y min-h-28", className)}
        {...props}
      />
    );
  },
);

export default Textarea;
