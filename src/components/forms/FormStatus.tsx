"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormStatusProps {
  status: "success" | "error";
  children: React.ReactNode;
  className?: string;
}

/**
 * FormStatus — inline success/error banner with an aria-live region so screen
 * readers announce the result. Success uses accent-subtle; error uses red.
 */
export function FormStatus({ status, children, className }: FormStatusProps) {
  return (
    <div
      role={status === "error" ? "alert" : "status"}
      aria-live={status === "error" ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-2.5 rounded-sm border px-3.5 py-3 text-small",
        status === "success"
          ? "border-accent/30 bg-accent-subtle text-text"
          : "border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300",
        className,
      )}
    >
      <span aria-hidden="true" className="mt-px shrink-0">
        {status === "success" ? (
          <svg viewBox="0 0 20 20" className="size-4" fill="none">
            <path
              d="M4 10.5l3.5 3.5L16 6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" className="size-4" fill="none">
            <path
              d="M10 6.5v4M10 13.5h.01M10 2.5L1.5 17h17L10 2.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <div>{children}</div>
    </div>
  );
}

export default FormStatus;
