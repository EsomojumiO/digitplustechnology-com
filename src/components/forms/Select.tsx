"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { controlBase } from "./controls";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  /** Optional placeholder rendered as a disabled first option. */
  placeholder?: string;
}

/** Select — token-styled native select with a chevron. Pair with <Field>. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { className, options, placeholder, defaultValue, value, ...props },
    ref,
  ) {
    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          defaultValue={
            value === undefined ? (defaultValue ?? (placeholder ? "" : undefined)) : undefined
          }
          className={cn(controlBase, "appearance-none pr-10", className)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  },
);

export default Select;
