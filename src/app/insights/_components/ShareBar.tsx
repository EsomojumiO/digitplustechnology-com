"use client";

import * as React from "react";

/**
 * ShareBar — accessible social-share row with no external SDKs.
 *
 * X/Twitter and LinkedIn are plain anchors to their share intents (work without
 * JS). Copy-link is a button that uses the Clipboard API with a graceful
 * fallback; it shows a transient "Copied" confirmation announced politely.
 *
 * The absolute URL is built on the server (siteConfig.url + path) and passed in,
 * so this island never needs to read window.location.
 */
export interface ShareBarProps {
  /** Absolute canonical URL of the article. */
  url: string;
  /** Article title (used for the share text). */
  title: string;
}

function IconButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-hairline bg-surface-raised text-muted transition-[color,background-color,border-color] duration-[var(--dur-fast)] hover:bg-surface hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {children}
    </a>
  );
}

export function ShareBar({ url, title }: ShareBarProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);

  async function copyLink() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* no-op — clipboard unavailable */
    }
  }

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-small font-medium text-muted">Share</span>
      <div className="flex items-center gap-2">
        <IconButton
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
          label="Share on X (Twitter)"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </IconButton>
        <IconButton
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          label="Share on LinkedIn"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
          </svg>
        </IconButton>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-hairline bg-surface-raised px-3 text-small font-medium text-muted transition-[color,background-color,border-color] duration-[var(--dur-fast)] hover:bg-surface hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span aria-hidden="true">{copied ? "Copied" : "Copy link"}</span>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? "Link copied to clipboard" : ""}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ShareBar;
