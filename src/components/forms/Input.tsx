"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { controlBase } from "./controls";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** Input — token-styled text input. Pair with <Field> for labels/errors. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, type = "text", ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(controlBase, className)}
        {...props}
      />
    );
  },
);

export default Input;
