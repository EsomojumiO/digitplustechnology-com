"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Warning } from "@/components/ui/icons";

export interface FormStatusProps {
  status: "success" | "error";
  children: React.ReactNode;
  className?: string;
}

/**
 * FormStatus, inline success/error banner with an aria-live region so screen
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
          ? "border-accent-green/30 bg-brand-subtle text-text"
          : "border-danger-border/40 bg-danger-subtle text-danger",
        className,
      )}
    >
      <span aria-hidden="true" className="mt-px shrink-0">
        {status === "success" ? (
<Check />
        ) : (
<Warning />
        )}
      </span>
      <div>{children}</div>
    </div>
  );
}

export default FormStatus;
