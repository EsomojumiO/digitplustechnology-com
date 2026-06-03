"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  /** Stable id used to wire label + control + error/hint via aria. */
  id: string;
  label: string;
  /** Marks the field required (visual asterisk + announced to AT). */
  required?: boolean;
  /** Optional helper text shown under the label. */
  hint?: string;
  /** Inline error message; sets aria-invalid + aria-describedby on the child. */
  error?: string;
  className?: string;
  /**
   * Render-prop receiving the aria wiring to spread onto the control so the
   * control stays a single source of truth for accessibility attributes.
   */
  children: (aria: {
    id: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
    "aria-required"?: boolean;
  }) => React.ReactNode;
}

/**
 * Field, accessible label + control + hint/error wrapper.
 * Generates aria-describedby/aria-invalid and passes them to the control.
 */
export function Field({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-small font-medium text-text">
        {label}
        {required && (
          <span className="text-accent" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-caption text-muted">
          {hint}
        </p>
      )}

      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
      })}

      {error && (
        <p id={errorId} className="text-caption text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Field;
