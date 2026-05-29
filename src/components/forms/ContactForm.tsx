"use client";

import * as React from "react";
import { Button } from "@/components/ui";
import { track } from "@/lib/analytics";
import { services, siteConfig } from "@/lib/site";
import { Field } from "./Field";
import { FormStatus } from "./FormStatus";
import { Honeypot } from "./Honeypot";
import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";
import { isEmail } from "./validation";

type Errors = Partial<Record<string, string>>;

const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: "other", label: "Other / Not sure" },
];

export interface ContactFormProps {
  className?: string;
}

/**
 * ContactForm — full contact form posting to /api/contact.
 * Client validation mirrors the zod rules; the server stays authoritative.
 */
export function ContactForm({ className }: ContactFormProps) {
  const [errors, setErrors] = React.useState<Errors>({});
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const successRef = React.useRef<HTMLDivElement>(null);

  function validateClient(fd: FormData): Errors {
    const next: Errors = {};
    if (!String(fd.get("fullName") ?? "").trim())
      next.fullName = "Full name is required.";
    const email = String(fd.get("email") ?? "").trim();
    if (!email) next.email = "Email is required.";
    else if (!isEmail(email)) next.email = "Enter a valid email address.";
    if (!String(fd.get("company") ?? "").trim())
      next.company = "Company is required.";
    if (!String(fd.get("serviceInterest") ?? ""))
      next.serviceInterest = "Select a service interest.";
    if (!String(fd.get("message") ?? "").trim())
      next.message = "Message is required.";
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
      // Focus the first invalid control.
      const firstKey = Object.keys(clientErrors)[0];
      form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }
    setErrors({});
    setPending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: fd.get("fullName"),
          email: fd.get("email"),
          phone: fd.get("phone") || undefined,
          company: fd.get("company"),
          serviceInterest: fd.get("serviceInterest"),
          message: fd.get("message"),
          company_website: fd.get("company_website") ?? "",
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        track("contact_submit", { service: String(fd.get("serviceInterest")) });
        setDone(true);
        form.reset();
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }

      if (res.status === 400 && data.errors) {
        const mapped: Errors = {};
        for (const [k, v] of Object.entries(
          data.errors as Record<string, string[]>,
        )) {
          mapped[k] = Array.isArray(v) ? v[0] : String(v);
        }
        setErrors(mapped);
        const firstKey = Object.keys(mapped)[0];
        if (firstKey)
          form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
        return;
      }

      setServerError(
        data.message ?? "Something went wrong. Please try again.",
      );
    } catch {
      setServerError(
        "Could not reach the server. Check your connection and try again.",
      );
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className={className}
        style={{ outline: "none" }}
      >
        <FormStatus status="success">
          <p className="font-medium">Thank you — your message has been received.</p>
          <p className="mt-1 text-muted">
            Our team will respond shortly. For anything urgent, call{" "}
            <a className="underline" href={siteConfig.phoneHref}>
              {siteConfig.phone}
            </a>
            .
          </p>
        </FormStatus>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className={className}
      onSubmit={onSubmit}
      noValidate
      aria-busy={pending}
    >
      <div className="flex flex-col gap-5">
        {serverError && <FormStatus status="error">{serverError}</FormStatus>}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="contact-fullName" label="Full name" required error={errors.fullName}>
            {(aria) => (
              <Input {...aria} name="fullName" autoComplete="name" maxLength={120} />
            )}
          </Field>
          <Field id="contact-email" label="Email" required error={errors.email}>
            {(aria) => (
              <Input
                {...aria}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
              />
            )}
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="contact-phone" label="Phone" hint="Optional" error={errors.phone}>
            {(aria) => (
              <Input
                {...aria}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={40}
              />
            )}
          </Field>
          <Field id="contact-company" label="Company / Organisation" required error={errors.company}>
            {(aria) => (
              <Input {...aria} name="company" autoComplete="organization" maxLength={160} />
            )}
          </Field>
        </div>

        <Field
          id="contact-serviceInterest"
          label="Service interest"
          required
          error={errors.serviceInterest}
        >
          {(aria) => (
            <Select
              {...aria}
              name="serviceInterest"
              options={serviceOptions}
              placeholder="Select a service…"
            />
          )}
        </Field>

        <Field id="contact-message" label="How can we help?" required error={errors.message}>
          {(aria) => (
            <Textarea
              {...aria}
              name="message"
              maxLength={4000}
              placeholder="Tell us about your project, timeline, and locations involved."
            />
          )}
        </Field>

        <Honeypot />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Sending…" : "Send message"}
          </Button>
          <p className="text-caption text-muted">
            Your details are never shared with third parties.
          </p>
        </div>
      </div>
    </form>
  );
}

export default ContactForm;
