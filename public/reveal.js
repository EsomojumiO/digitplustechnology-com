/*
 * reveal.js — scroll-reveal, independent of React/framer so it behaves
 * identically in every browser (Safari included).
 *
 * Content is visible by default. CSS hides `.reveal-init` ONLY while
 * `html.reveal-ready` is set; this script adds `.reveal-in` to reveal an element
 * (transitioning it from the hidden state), and never sets `reveal-ready` at all
 * under reduced motion. If the script never runs, `reveal-ready` is never set and
 * everything stays visible — content can never get stuck hidden.
 *
 * Two things this file gets right that the naive version did not:
 *
 * 1. REDUCED MOTION IS GATED IN JS, not left to the CSS cascade. Under reduce we
 *    return before adding `reveal-ready`, so the hidden rule's `html.reveal-ready`
 *    ancestor never matches and content is unconditionally visible. The CSS reduce
 *    override still exists as defense-in-depth, but we no longer DEPEND on it —
 *    and we shouldn't have: base-hide (opacity:0) and the reduce override
 *    (opacity:1) have identical specificity, so the override only won on emission
 *    order. A layer re-sort would have silently hidden content from exactly the
 *    users who opted out of motion. Not relying on that tie is the fix.
 *
 * 2. ABOVE-THE-FOLD ELEMENTS REVEAL AFTER FIRST PAINT. The old code added
 *    `reveal-in` synchronously to everything already in view, in the same task
 *    that set `reveal-ready` — both before first paint. The browser never painted
 *    the hidden start state, so there was nothing to transition FROM and the
 *    element simply appeared. The entire above-the-fold first impression was
 *    static. Deferring the on-screen batch by two animation frames lets the
 *    hidden state paint once, so the reveal actually animates. Below-the-fold was
 *    always fine — the observer fires long after first paint.
 */
(function () {
  var reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reduced motion: never enter the hidden state. Content is already visible by
  // default (no `reveal-ready`), so there is nothing to do and nothing to animate.
  if (reduce) return;

  // Confirmed running AND motion is allowed — now it's safe to hide-then-reveal.
  document.documentElement.classList.add("reveal-ready");

  function add(el) {
    el.classList.add("reveal-in");
  }

  // Reveal a batch on the next paintable frame. Two rAFs: the first lets the
  // hidden state (opacity 0 / translateY) paint; the second flips the class so
  // the transition has a real start and end. Without this, an already-visible
  // element gets `reveal-in` before its hidden state ever painted and jumps in.
  function revealAfterPaint(list) {
    if (!list.length) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        for (var k = 0; k < list.length; k++) add(list[k]);
      });
    });
  }

  function setup() {
    var nodes = document.querySelectorAll(".reveal-init:not(.reveal-in)");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      revealAfterPaint(Array.prototype.slice.call(nodes));
      return;
    }

    var vh = window.innerHeight || document.documentElement.clientHeight;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            // Below-the-fold: fires after first paint, so reveal directly — the
            // hidden state has already painted and the transition runs.
            add(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    var onscreen = [];
    for (var j = 0; j < nodes.length; j++) {
      var el = nodes[j];
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) onscreen.push(el);
      else io.observe(el);
    }
    // Above-the-fold: defer so the hidden state paints first (see note 2).
    revealAfterPaint(onscreen);
  }

  function start() {
    setup();
    // Catch nodes added by client-side navigation.
    if ("MutationObserver" in window) {
      var pending = false;
      var mo = new MutationObserver(function () {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () {
          pending = false;
          setup();
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
    // Failsafe: reveal anything still hidden once everything has loaded.
    window.addEventListener("load", setup);
  }

  if (document.readyState !== "loading") start();
  else document.addEventListener("DOMContentLoaded", start);
})();
