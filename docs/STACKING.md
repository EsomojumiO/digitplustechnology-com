# Stacking, layers and overlays

One page for every question of the form "why is this thing on top of / behind that
thing". Read it before writing any `z-index`.

Gate: `npm run gate:stacking` (part of `npm run gates`).

---

## 1. The layer scale

Defined once, in `src/app/globals.css` under `@theme inline` as `--z-index-*`, which
Tailwind turns into real utilities (`z-header`, `z-overlay`, …).

| Token | Value | Utility | For |
|---|---|---|---|
| `base` | 0 | `z-base` | resting content |
| `content` | 10 | `z-content` | a raised element inside a component (hero text over a scrim) |
| `raised` | 20 | `z-raised` | a control floating over that (carousel progress bars) |
| `dropdown` | 30 | `z-dropdown` | disclosure panels inside the header |
| `header` | 100 | `z-header` | the site header |
| `toast` | 200 | `z-toast` | cookie consent, transient notices |
| `overlay` | 300 | `z-overlay` | mobile nav, modal dialogs, their backdrops |
| `skip` | 400 | `z-index: var(--z-index-skip)` | the skip link — must beat everything |

Gaps are deliberate: room to slot a layer in without renumbering.

**Never write a raw z-number in a component again.** `z-[60]` in one file and `z-[70]`
in another is not an ordering — it is two guesses that happened not to collide yet.

### Local vs global layers

`content` / `raised` / `dropdown` are **local**: they order children *inside* a
component that is itself a stacking context. `header` and above are **global**: they
compete in the root stacking context.

That distinction only holds if the component actually is a stacking context — see §2.

### Why `overlay` outranks `toast`

The mobile nav is `aria-modal="true"` and covers the viewport. With `toast` on top,
the cookie banner (`inset-x-3 bottom-3`, i.e. full width at 390px) painted over the
open menu's contact row and its "Get a proposal" button: the modal's primary action
sat behind a non-modal notice. A modal outranks a notice.

Found by the gate's pixel probe, not by eye.

---

## 2. The rule: isolate anything that stacks internally

> A component that orders things internally **must** carry `isolate`
> (`isolation: isolate`).

`position: relative` with `z-index: auto` is **not** a stacking context. Without one,
a child's `z-index: 10` is not "10 within this component" — it is resolved against the
**root** stacking context, where it competes directly with site chrome.

That is exactly how the hero carousel's scrim (`z-1`), overlay text (`z-content`) and
progress bars (`z-raised`) ended up as peers of the header in the page's stacking
order. They only lost to the header because the header's number happened to be bigger.

`isolation: isolate` creates a stacking context without touching layout, paint or the
element's own z-index. It costs nothing. Use it.

Currently isolated: `HeroCarousel` (section + each slide), `ui/Hero`, the home closing
CTA band, `ProcessTimeline` nodes.

The gate enforces this: it walks every positioned element with a positive `z-index`,
finds its nearest stacking-context ancestor, and fails if there isn't one below the
`header` layer.

---

## 3. The trap that caused the reported bug

**Symptom (client, on a phone):** open the mobile nav on the home page and the hero
carousel shows instead of the menu.

**It was not a z-index problem.** The numbers were already correct — menu 60, header
50, hero 20.

The header carries `backdrop-blur-xl backdrop-saturate-150`. A non-`none`
`backdrop-filter` — like `filter`, `transform`, `perspective`, `contain: paint` and
`will-change` on any of those — makes an element the **containing block for its
`position: fixed` descendants**.

The menu was rendered inside `<header>`. So its `fixed inset-0` resolved against the
header's **390×48** box instead of the **390×844** viewport. The panel collapsed to a
48px strip, its own `overflow-hidden` (there to stop the off-canvas panel causing
horizontal scroll) clipped the nav away, and the hero filled the rest of the screen.

No z-index could have fixed that. The panel was 48 pixels tall.

**Fix:** render the menu as a sibling of `<header>`, not a child. Its containing block
is the viewport again.

This is the **second** time this site has hit this trap — the deleted `.route-enter`
wrapper (see the note in `globals.css` §4) had `transform: translateY(8px)` around
every page and collapsed fixed descendants the same way.

### Checklist for any new `position: fixed` element

1. Is any ancestor carrying `transform`, `filter`, `backdrop-filter`, `perspective`,
   `contain: paint/strict/content`, or `will-change` on those? If yes, your `fixed` is
   not fixed to the viewport.
2. Safest home for an overlay: a direct child of `<body>` (see `layout.tsx` — that is
   why `CookieConsent` lives there).
3. Add it to the gate.

---

## 4. Visual check states

The gate writes a screenshot per state to `.screenshots/` (gitignored) and lists them
in `.screenshots/STATES.md`.

**Open states are first-class.** The mobile-nav bug was invisible to every other gate
because every other gate only ever looked at a page with nothing open.

| State | Viewport | What it proves |
|---|---|---|
| `<page>-390-default` | 390×844 | baseline; no local z-index leaks |
| `<page>-390-menu-open` | 390×844 | the mobile nav paints above the hero |
| `<page>-768-contact-open` | 768×1024 | the Contact dropdown paints above the hero |
| `home-390-cookie-banner` | 390×844 | the consent banner paints above the hero |
| `<page> @390 keyboard` | 390×844 | the modal contract, driven by keyboard only (§5) |

Pages covered: `/` (carousel + scroll-scrub band), `/services` (control),
`/approach` (timeline's raised nodes).

The Contact dropdown is `hidden sm:block`, so it does not exist below 640px — it is
exercised at 768px, where the mobile menu still applies (`lg:hidden`).

### What each state asserts

Assertions, not eyeballs — a screenshot nobody opens proves nothing:

1. **Geometry** — the overlay's `fixed` containing block is the viewport, and no
   filtered/transformed ancestor sits above it. This is the one that catches the root
   cause; when it fails it names the offending ancestor and why.
2. **Pixels** — a 24×24 patch of the real screenshot inside the overlay is sampled and
   compared against the overlay's own computed background. Hit-testing is not proof of
   paint; this is. A dark patch inside a light panel fails hard as "the hero is showing
   through".
3. **Hit test** — `elementFromPoint` at three points inside the overlay lands in the
   overlay, and reports when it lands in the carousel instead.
4. **Isolation** — §2, enforced.

The gate is verified non-vacuous: reverting the menu back inside `<header>` makes it
fail on all three pages with
`fixed overlay does not span the viewport — got 390x48 ... <header ...> [backdrop-filter]`.

---

## 5. The mobile nav is a real modal

Painting on top is only half of "above". An overlay that covers the page visually
while the page stays keyboard- and screen-reader-reachable underneath is still broken —
just invisibly.

`MobileMenu` declares `role="dialog" aria-modal="true"`, so it owes the full contract:

| Requirement | How |
|---|---|
| Background unreachable | `inert` on every `<body>` child except the menu root, applied on open and removed on close |
| Focus stays inside | wrap-around Tab / Shift+Tab trap on the panel |
| Focus starts inside | the panel itself is focused (not the first link), so a screen reader announces the dialog's label first |
| Focus returns home | `document.activeElement` is captured before opening and refocused on close, guarded on `isConnected` |
| Escape closes | `keydown` on document |
| Closed = out of the way | `inert={!open}` on the root |

### Why `inert`, and why the trap as well

They cover different halves and you need both:

- **`inert`** removes the background from the tab order *and* the accessibility tree.
  A Tab-cycling trap alone does nothing for a screen-reader user swipe-browsing the
  page behind the dialog.
- **The trap** keeps Tab from walking off the end of the panel into browser chrome,
  which `inert` does not prevent.

`inert` also replaced an `aria-hidden={!open}`-only closed state. That was a real
defect: `aria-hidden` hides from screen readers but leaves the tab order untouched, so
the 24 links in the off-canvas panel sat in the tab order of every page at every
width. `aria-hidden` stays alongside `inert` as a fallback for browsers without it.

### The keyboard walk

`assertModalKeyboard` in the gate drives the nav with the keyboard only — no mouse, no
programmatic focus. It tabs to the trigger, opens with Enter, presses Tab 40 times and
Shift+Tab 20 times asserting focus never leaves the dialog, checks every background
sibling is actually `inert`, presses Escape, and asserts focus lands back on the
trigger and the closed panel is out of the tab order.

Also verified non-vacuous. With the trap, inerting and focus restore removed it fails
with, among others:

```
focus escaped the modal on 16/40 Tab presses — step 25: <a> "Explore managed IT→"
41/41 background elements are NOT inert while the modal is open — div, a, header, main#main, footer, ...
Escape did not return focus to the trigger — focus is on <a> "Contact"
with the menu closed the panel is not inert — its 24 links stay in the tab order
```

That step-25 escape is the point: focus had walked out of the open menu and onto the
hero carousel's CTA behind it.

---

## 6. Lint ratchet

`prebuild` runs `eslint` before `next build`, so **lint errors fail the build** — on
Vercel too, since it invokes `npm run build`. The error count is at 0 and can only go
down.

Warnings stay advisory (7 at the time of writing, all unused-vars and
anonymous-default-export in scripts and content tooling); eslint's exit code ignores
them unless `--max-warnings` is set.

The two errors this replaced were not style nits:

- `HeroCarousel` read `autoplay.current` during render and called `Autoplay()` /
  `Fade()` on every render. Reading a ref during render is unsafe under concurrent
  rendering — React can render a component without committing it — and the fresh
  plugin array made embla re-initialise on every render. Now memoised on `reduce`,
  with pause/resume going through `emblaApi.plugins().autoplay` instead of a ref.
- `Stagger` incremented a `let index` declared in the component body from inside a
  `Children.map` callback. React can render a component more than once per commit, and
  each pass kept incrementing the same binding — so the delay a `StaggerItem` received
  depended on how many times React happened to render its parent. The walk is now a
  module-scope pure function carrying a per-call cursor object.
