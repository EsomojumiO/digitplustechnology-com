"use client";

import * as React from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { FormStatus } from "./FormStatus";
import { Honeypot } from "./Honeypot";
import { Input } from "./Input";
import { isEmail } from "./validation";

export interface NewsletterFormProps {
  className?: string;
  /** Optional id prefix to keep label/input ids unique if used twice on a page. */
  idPrefix?: string;
  /** Submit button label. */
  buttonLabel?: string;
}

/**
 * NewsletterForm — compact email signup posting to /api/newsletter.
 * Replaces the footer's static form. Inline success/error states.
 */
export function NewsletterForm({
  className,
  idPrefix = "newsletter",
  buttonLabel = "Subscribe",
}: NewsletterFormProps) {
  const id = `${idPrefix}-email`;
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const liveRef = React.useRef<HTMLDivElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();

    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!isEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          company_website: fd.get("company_website") ?? "",
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        track("newsletter_signup");
        setDone(true);
        form.reset();
        requestAnimationFrame(() => liveRef.current?.focus());
        return;
      }
      if (res.status === 400 && data.errors?.email) {
        setError(
          Array.isArray(data.errors.email)
            ? data.errors.email[0]
            : String(data.errors.email),
        );
        return;
      }
      setError(data.message ?? "Something went wrong. Please try again.");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div ref={liveRef} tabIndex={-1} className={cn(className)} style={{ outline: "none" }}>
        <FormStatus status="success">You&apos;re subscribed. Thank you.</FormStatus>
      </div>
    );
  }

  return (
    <form className={cn("flex flex-col gap-2", className)} onSubmit={onSubmit} noValidate>
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          maxLength={254}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="sm:flex-1"
        />
        <Button type="submit" disabled={pending} className="shrink-0">
          {pending ? "Subscribing…" : buttonLabel}
        </Button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-caption text-red-600" role="alert">
          {error}
        </p>
      )}
      <Honeypot />
    </form>
  );
}

export default NewsletterForm;
