/*
 * reveal.js — scroll-reveal, completely independent of React/framer so it
 * behaves identically in every browser (Safari included).
 *
 * Content is visible by default; CSS hides `.reveal-init` only while
 * `html.reveal-ready` is set. This script reveals elements (adds `.reveal-in`)
 * when they're on screen, immediately for anything already in view, and watches
 * for client-navigation-added nodes. If anything here fails, content simply
 * stays visible — it can never get stuck hidden.
 */
(function () {
  // Enable hiding ONLY now that this script is confirmed running. If it never
  // runs (blocked/old browser/JS off), `reveal-ready` is never set and all
  // content stays visible — it can never get stuck hidden.
  document.documentElement.classList.add("reveal-ready");

  function add(el) {
    el.classList.add("reveal-in");
  }

  function setup() {
    var nodes = document.querySelectorAll(".reveal-init:not(.reveal-in)");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < nodes.length; i++) add(nodes[i]);
      return;
    }

    var vh = window.innerHeight || document.documentElement.clientHeight;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            add(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    for (var j = 0; j < nodes.length; j++) {
      var el = nodes[j];
      var r = el.getBoundingClientRect();
      // Already on screen → reveal now (don't wait for a scroll).
      if (r.top < vh && r.bottom > 0) add(el);
      else io.observe(el);
    }
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
