"use client";

import * as React from "react";
import { Button } from "@/components/ui";
import { track } from "@/lib/analytics";
import { Field } from "./Field";
import { FormStatus } from "./FormStatus";
import { Honeypot } from "./Honeypot";
import { Input } from "./Input";
import { isEmail } from "./validation";

type Errors = Partial<Record<string, string>>;

export interface ReportGateFormProps {
  /** Report slug, determines the PDF url returned on success. */
  reportSlug: string;
  /** Human title, used in the success message. */
  reportTitle: string;
  className?: string;
}

/**
 * ReportGateForm, gates a quarterly-report PDF behind a lead form.
 * On success it reveals the download link returned by the server.
 */
export function ReportGateForm({
  reportSlug,
  reportTitle,
  className,
}: ReportGateFormProps) {
  const [errors, setErrors] = React.useState<Errors>({});
  const [pending, setPending] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const revealRef = React.useRef<HTMLDivElement>(null);

  function validateClient(fd: FormData): Errors {
    const next: Errors = {};
    if (!String(fd.get("fullName") ?? "").trim())
      next.fullName = "Full name is required.";
    const email = String(fd.get("workEmail") ?? "").trim();
    if (!email) next.workEmail = "Work email is required.";
    else if (!isEmail(email)) next.workEmail = "Enter a valid email address.";
    if (!String(fd.get("company") ?? "").trim())
      next.company = "Company is required.";
    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setServerError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const clientErrors = validateClient(fd);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      const firstKey = Object.keys(clientErrors)[0];
      form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }
    setErrors({});
    setPending(true);

    try {
      const res = await fetch("/api/report-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: fd.get("fullName"),
          workEmail: fd.get("workEmail"),
          company: fd.get("company"),
          role: fd.get("role") || undefined,
          reportSlug,
          subscribe: fd.get("subscribe") === "on",
          company_website: fd.get("company_website") ?? "",
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        track("report_lead_submit", { report: reportSlug });
        const url =
          (data.data?.pdfUrl as string | undefined) ??
          `/reports/${reportSlug}.pdf`;
        setPdfUrl(url);
        requestAnimationFrame(() => revealRef.current?.focus());
        return;
      }

      if (res.status === 400 && data.errors) {
        const mapped: Errors = {};
        for (const [k, v] of Object.entries(
          data.errors as Record<string, string[]>,
        )) {
          // map server "workEmail" etc. straight through
          mapped[k] = Array.isArray(v) ? v[0] : String(v);
        }
        setErrors(mapped);
        const firstKey = Object.keys(mapped)[0];
        if (firstKey)
          form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
        return;
      }

      setServerError(data.message ?? "Something went wrong. Please try again.");
    } catch {
      setServerError("Could not reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (pdfUrl) {
    return (
      <div ref={revealRef} tabIndex={-1} className={className} style={{ outline: "none" }}>
        <FormStatus status="success">
          <p className="font-medium">Your download is ready.</p>
          <p className="mt-1 text-muted">
            Thank you. {reportTitle} is available below.
          </p>
        </FormStatus>
        <div className="mt-4">
          <Button
            href={pdfUrl}
            size="lg"
            // open in a new tab and hint a download; the file is a static asset
            {...{ download: "", target: "_blank", rel: "noopener" }}
            onClick={() => track("report_download", { report: reportSlug })}
          >
            Download the PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className={className} onSubmit={onSubmit} noValidate aria-busy={pending}>
      <div className="flex flex-col gap-5">
        {serverError && <FormStatus status="error">{serverError}</FormStatus>}

        <Field id="report-fullName" label="Full name" required error={errors.fullName}>
          {(aria) => (
            <Input {...aria} name="fullName" autoComplete="name" maxLength={120} />
          )}
        </Field>

        <Field id="report-workEmail" label="Work email" required error={errors.workEmail}>
          {(aria) => (
            <Input
              {...aria}
              name="workEmail"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={254}
            />
          )}
        </Field>

        <Field id="report-company" label="Company" required error={errors.company}>
          {(aria) => (
            <Input {...aria} name="company" autoComplete="organization" maxLength={160} />
          )}
        </Field>

        <Field id="report-role" label="Role" hint="Optional" error={errors.role}>
          {(aria) => (
            <Input {...aria} name="role" autoComplete="organization-title" maxLength={120} />
          )}
        </Field>

        <label className="flex items-start gap-2.5 text-small text-text">
          <input
            type="checkbox"
            name="subscribe"
            className="mt-0.5 size-4 rounded-sm border-hairline text-accent accent-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          <span>Also send me the next quarterly report.</span>
        </label>

        <Honeypot />

        <div className="flex flex-col gap-3">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Preparing…" : "Get the report"}
          </Button>
          <p className="text-caption text-muted">
            We use your details only to deliver this report and relevant updates.
            Never shared with third parties.
          </p>
        </div>
      </div>
    </form>
  );
}

export default ReportGateForm;
