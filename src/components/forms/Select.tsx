"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { controlBase } from "./controls";
import { ChevronDown } from "@/components/ui/icons";

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

/** Select, token-styled native select with a chevron. Pair with <Field>. */
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
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
      </div>
    );
  },
);

export default Select;
