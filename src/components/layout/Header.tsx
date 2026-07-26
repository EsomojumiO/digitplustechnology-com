"use client";

import * as React from "react";
import { ctaLabels } from "@/lib/cta";
import { Link } from "next-view-transitions";
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
/**
 * NavBadge — status pill beside a nav label, e.g. "Coming soon".
 *
 * The row stays a live link on purpose: a product that isn't shipping yet is
 * still worth linking to, and disabling the row would hide the destination.
 * Hairline border + muted text so it reads as status, not as a second CTA.
 */
function NavBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-hairline px-2 py-0.5 text-[0.6875rem] font-medium leading-none text-muted">
      {children}
    </span>
  );
}

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

      {/* Disclosure navigation, NOT the ARIA menu pattern (W3C APG). The old
          markup was role="menu" > <ul> > <li role="none"> > <a role="menuitem">,
          which axe flags critical three ways: the menu's required child is a
          menuitem (it got a <ul>), each menuitem's required parent is a
          menu (it got an <li>), and role="none" on an <li> makes the <ul>
          contain a non-<li>. role="menu" means an application menu — this is a
          list of navigation links, so plain semantics are both correct and
          quieter for screen readers. (Pre-existing: also on redesign/dark-raycast.) */}
      <div
        id={id}
        aria-label={item.label}
        className={cn(
          // Local layer inside the header's stacking context (the header is one
          // already — sticky + z-index + backdrop-filter), so this only has to
          // beat its siblings in the nav rail, never the page.
          "absolute left-0 top-full z-dropdown pt-2",
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
            <li key={child.href}>
              <Link
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
                <span className="flex items-center gap-1.5 text-small font-medium text-text">
                  {child.label}
                  {child.badge && <NavBadge>{child.badge}</NavBadge>}
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
   Mobile menu, full-screen slide-over. A real modal: scroll lock, focus trap,
   inert background, Escape/backdrop close, and focus returned to the trigger.
   --------------------------------------------------------------------------- */

/** Tabbable descendants, in DOM order, skipping anything hidden or disabled. */
function focusablesIn(root: HTMLElement): HTMLElement[] {
  const sel = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");
  return Array.from(root.querySelectorAll<HTMLElement>(sel)).filter(
    // offsetParent is null for display:none subtrees; the panel itself is
    // always laid out, so this only filters genuinely hidden controls.
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const root = rootRef.current;
    if (!panel || !root) return;

    /* Remember who opened us, so focus can go home on close. Captured before
       anything else touches focus. */
    const trigger =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    /* INERT THE BACKGROUND. This is the half a Tab-cycling trap cannot do:
       `inert` removes the rest of the page from the tab order AND from the
       accessibility tree, so a screen-reader user can't swipe-browse into the
       page behind an open modal either. Without it a keyboard user could tab
       straight out of the nav and into the cookie banner sitting behind it.

       The menu is a direct child of <body> (it has to be — see the note at the
       Header return), so its siblings are exactly the page: header, main,
       footer, the consent banner, the skip link. */
    const backgrounded: HTMLElement[] = [];
    for (const el of Array.from(document.body.children)) {
      if (el === root || !(el instanceof HTMLElement)) continue;
      if (el.inert) continue; // already inert for another reason — leave it
      el.inert = true;
      backgrounded.push(el);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      /* Wrap-around trap. `inert` alone would let Tab escape to the browser
         chrome at the end of the panel; cycling keeps the user inside the
         dialog, which is what the ARIA modal pattern asks for. */
      const items = focusablesIn(panel);
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (active instanceof Node && !panel.contains(active)) {
        // Focus somehow landed outside (programmatic focus, browser quirk).
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener("keydown", onKey);

    /* Focus the panel itself rather than the first link: a screen reader then
       announces the dialog's label before its contents. Deferred a tick so it
       happens after the open transition starts and after inert is applied. */
    const t = setTimeout(() => panel.focus(), 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      for (const el of backgrounded) el.inert = false;
      /* Return focus to the trigger. Guarded on the element still being in the
         document — a route change can unmount it while the menu is open. */
      if (trigger && trigger.isConnected) trigger.focus();
    };
  }, [open, onClose]);

  return (
    <div
      ref={rootRef}
      className={cn(
        // overflow-hidden is load-bearing, not cosmetic: the panel below parks
        // itself off-canvas with `translate-x-full`, and with nothing clipping
        // it the document grew to 774px against a 390px viewport — so EVERY
        // page scrolled sideways on a phone. Clipping here costs nothing (the
        // panel is fully inside the viewport once open).
        //
        // `fixed inset-0` only means "the viewport" while NO ancestor is a
        // containing block for fixed descendants. That is why this component is
        // rendered as a SIBLING of <header>, not inside it — see the note at
        // the Header return. Keep it that way.
        "fixed inset-0 z-overlay overflow-hidden lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      /* When closed, the panel is only parked off-canvas with `translate-x-full`
         — its links are still in the DOM and were still TABBABLE. A keyboard
         user tabbing the page fell into a nav they couldn't see. `inert` is the
         fix that `aria-hidden` never was: aria-hidden hides from screen readers
         but leaves the tab order untouched (and aria-hidden wrapped around
         focusable elements is itself an axe finding). aria-hidden stays as the
         fallback for browsers without inert. */
      inert={!open}
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
                          <span className="inline-flex items-center gap-1.5">
                            {child.label}
                            {child.badge && <NavBadge>{child.badge}</NavBadge>}
                            {child.external ? " ↗" : ""}
                          </span>
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
            {ctaLabels.generic}
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
      {/* Disclosure, not the ARIA menu pattern — see DesktopDropdown. */}
      <div
        id={id}
        aria-label="Contact"
        className={cn(
          // Local layer — see DesktopDropdown. The header's stacking context
          // carries the whole dropdown above the page for free.
          "absolute right-0 top-full z-dropdown mt-2 w-60 rounded-xl border border-hairline bg-surface-raised p-1.5 shadow-[var(--shadow-lg)]",
          "transition-[opacity,transform] duration-[var(--dur-base)] ease-[var(--ease-out)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {CONTACT_ROWS.map((r) => (
          <a
            key={r.label}
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
    <>
    <header
      className={cn(
        "sticky top-0 z-header w-full border-b border-hairline",
        // Frosted white glass: rgba(255,255,255,0.72) + blur over a #d2d2d7
        // hairline. The opaque fallback stays fully white so the bar never
        // reads as grey where backdrop-filter is unsupported.
        "bg-white backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/72",
      )}
    >
      {/* ~48px bar — Apple's nav is a quiet rail, not a shelf. */}
      <Container as="div" className="flex h-12 items-center justify-between gap-4">
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
          {/* Orange chevron LINK, not an orange fill. The header is sticky, so
              an orange pill here put a second fill in every viewport that also
              showed a page CTA — breaking "one orange fill per viewport". The
              brief's own prescription for repeat CTA placements is an orange
              text-link with a chevron, and it lets the page's real CTA own the
              only fill on screen. Ember-700 ink at 7.77:1. */}
          <Link
            href="/contact"
            className={cn(
              "hidden items-center gap-1 rounded-md px-3 py-2 text-small font-semibold sm:inline-flex",
              "text-accent-ink transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
              "hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green",
            )}
          >
            {ctaLabels.generic}
            <span aria-hidden="true">›</span>
          </Link>

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
    </header>

    {/* OUTSIDE <header> ON PURPOSE — this was the mobile-nav bug.
        The header carries `backdrop-blur-xl backdrop-saturate-150`. A non-none
        `backdrop-filter` (like `filter`, `transform` and `perspective`) makes an
        element the CONTAINING BLOCK for its `position: fixed` descendants. So
        while the menu lived inside the header, its `fixed inset-0` resolved
        against the header's 390x48 box instead of the 390x844 viewport: the
        panel collapsed to a 48px strip, its own `overflow-hidden` clipped the
        nav away, and the hero filled the rest of the screen — which reads
        exactly like "the menu renders behind the hero".

        No z-index could have fixed that; the panel was 48px tall. As a sibling
        of <header> the menu's containing block is the viewport again, and
        `z-overlay` puts it cleanly above `z-header`.

        Same trap as the deleted `.route-enter` wrapper (see globals.css §4) —
        second time this site has been bitten by a fixed descendant inside a
        filtered/transformed ancestor. */}
    <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

export default Header;
