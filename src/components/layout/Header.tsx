"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Container } from "@/components/ui";
import { cn } from "@/lib/utils";
import { mainNav, siteConfig, type NavItem } from "@/lib/site";
import { Logo } from "./Logo";

/* ---------------------------------------------------------------------------
   Small chevron icon (pixel-aligned, consistent stroke).
   --------------------------------------------------------------------------- */
function Chevron({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cn("h-3.5 w-3.5", className)}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Desktop dropdown, accessible: hover + focus open, Escape closes, arrow-key
   roving, and aria-expanded wiring.
   --------------------------------------------------------------------------- */
function DesktopDropdown({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = React.useRef<HTMLLIElement>(null);
  const id = React.useId();

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  React.useEffect(() => () => cancelClose(), []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown" && !open) {
      e.preventDefault();
      setOpen(true);
    }
  };

  // Close when focus leaves the whole group.
  const onBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
  };

  return (
    <li
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <Link
        href={item.href}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={id}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-small font-medium",
          "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
          "hover:text-text",
          active ? "text-text" : "text-muted",
        )}
      >
        {item.label}
        <Chevron
          className={cn(
            "text-muted transition-transform duration-[var(--dur-fast)]",
            open && "rotate-180",
          )}
        />
      </Link>

      <div
        id={id}
        role="menu"
        aria-label={item.label}
        className={cn(
          "absolute left-0 top-full z-50 pt-2",
          "transition-[opacity,transform] duration-[var(--dur-base)] ease-[var(--ease-out)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <ul
          className={cn(
            "grid w-[34rem] max-w-[calc(100vw-2rem)] grid-cols-2 gap-1 rounded-xl p-2",
            "border border-hairline bg-surface-raised shadow-[var(--shadow-lg)]",
          )}
        >
          {item.children?.map((child) => (
            <li key={child.href} role="none">
              <Link
                role="menuitem"
                href={child.href}
                tabIndex={open ? 0 : -1}
                target={child.external ? "_blank" : undefined}
                rel={child.external ? "noreferrer noopener" : undefined}
                className={cn(
                  "block rounded-lg px-3 py-2.5",
                  "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
                  "hover:bg-surface focus-visible:bg-surface",
                )}
              >
                <span className="flex items-center gap-1 text-small font-medium text-text">
                  {child.label}
                  {child.external && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="h-3 w-3 text-muted"
                    >
                      <path
                        d="M6 3h7v7M13 3l-8 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                {child.description && (
                  <span className="mt-0.5 block text-caption text-muted">
                    {child.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/* ---------------------------------------------------------------------------
   Mobile menu, full-screen slide-over. Locks scroll, Escape + backdrop close,
   focus moves into the panel on open.
   --------------------------------------------------------------------------- */
function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the panel.
    const t = setTimeout(() => panelRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-neutral-950/40 backdrop-blur-sm",
          "transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col",
          "border-l border-hairline bg-surface-raised shadow-[var(--shadow-lg)] outline-none",
          "transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-hairline px-5">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={cn(
              "grid h-10 w-10 place-items-center rounded-md text-muted",
              "transition-colors duration-[var(--dur-fast)] hover:bg-surface hover:text-text",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green",
            )}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav
          aria-label="Mobile"
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-4"
        >
          <ul className="flex flex-col gap-0.5">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-body font-medium text-text",
                    "transition-colors duration-[var(--dur-fast)] hover:bg-surface",
                  )}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mb-1 ml-3 flex flex-col gap-0.5 border-l border-hairline pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          target={child.external ? "_blank" : undefined}
                          rel={child.external ? "noreferrer noopener" : undefined}
                          className={cn(
                            "block rounded-md px-3 py-2 text-small text-muted",
                            "transition-colors duration-[var(--dur-fast)] hover:bg-surface hover:text-text",
                          )}
                        >
                          {child.label}
                          {child.external ? " ↗" : ""}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-hairline p-4">
          <div className="mb-3 grid grid-cols-3 gap-2">
            {CONTACT_ROWS.map((r) => (
              <a
                key={r.label}
                href={r.href(siteConfig)}
                target={"external" in r && r.external ? "_blank" : undefined}
                rel={"external" in r && r.external ? "noreferrer noopener" : undefined}
                onClick={onClose}
                className={cn(
                  "rounded-lg border border-hairline px-2 py-2.5 text-center text-caption font-medium text-muted",
                  "transition-colors duration-[var(--dur-fast)] hover:border-hairline-hover hover:text-text",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green",
                )}
              >
                {r.label}
              </a>
            ))}
          </div>
          <Button href="/contact" size="lg" className="w-full" onClick={onClose}>
            Get a quote
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Contact menu — replaces a bare phone number with a tidy ghost icon-button
   that opens Call / WhatsApp / Email. Keyboard + outside-click dismissible.
   --------------------------------------------------------------------------- */
function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M6.5 3.5 4 4c-.7 2 .3 5.2 3 8s6 3.7 8 3l.5-2.5-3-1.5-1.4 1.4c-1.2-.6-2.3-1.7-2.9-2.9L9.6 5.5 6.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CONTACT_ROWS = [
  { label: "Call", get: (v: typeof siteConfig) => v.phone, href: (v: typeof siteConfig) => v.phoneHref, mono: true },
  { label: "WhatsApp", get: () => "Chat on WhatsApp", href: (v: typeof siteConfig) => v.whatsapp, external: true },
  { label: "Email", get: (v: typeof siteConfig) => v.email, href: (v: typeof siteConfig) => `mailto:${v.email}` },
] as const;

function ContactMenu() {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative hidden sm:block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        aria-label="Contact options"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg border border-hairline text-muted",
          "transition-colors duration-[var(--dur-fast)] hover:border-hairline-hover hover:text-text",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green",
        )}
      >
        <PhoneIcon />
      </button>
      <div
        id={id}
        role="menu"
        aria-label="Contact"
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-hairline bg-surface-raised p-1.5 shadow-[var(--shadow-lg)]",
          "transition-[opacity,transform] duration-[var(--dur-base)] ease-[var(--ease-out)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {CONTACT_ROWS.map((r) => (
          <a
            key={r.label}
            role="menuitem"
            href={r.href(siteConfig)}
            target={"external" in r && r.external ? "_blank" : undefined}
            rel={"external" in r && r.external ? "noreferrer noopener" : undefined}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5",
              "transition-colors duration-[var(--dur-fast)] hover:bg-surface focus-visible:bg-surface",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green",
            )}
          >
            <span className="text-small font-medium text-text">{r.label}</span>
            <span
              className={cn(
                "text-caption text-muted",
                "mono" in r && r.mono && "font-mono",
              )}
            >
              {r.get(siteConfig)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Header
   --------------------------------------------------------------------------- */
export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-hairline",
        "bg-background/80 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background/65",
      )}
    >
      <Container as="div" className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {mainNav.map((item) =>
              item.children ? (
                <DesktopDropdown
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                />
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center rounded-md px-3 py-2 text-small font-medium",
                      "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-text",
                      isActive(item.href) ? "text-text" : "text-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ContactMenu />
          <Button href="/contact" size="sm" className="hidden sm:inline-flex">
            Get a quote
          </Button>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-md text-text lg:hidden",
              "transition-colors duration-[var(--dur-fast)] hover:bg-surface",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green",
            )}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </Container>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

export default Header;
