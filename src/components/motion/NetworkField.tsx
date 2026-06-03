"use client";

import * as React from "react";

export interface NetworkFieldProps {
  className?: string;
  /** Approx node count at 1280px wide; scales down on smaller viewports. */
  density?: number;
}

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Pulse = { a: number; b: number; t: number; speed: number };

/**
 * NetworkField, the Digitplus signature motif: a constellation of infrastructure
 * nodes (servers, branches, devices) linked by hairlines, with data pulses
 * travelling along connections in the brand accent. Drifts ambiently, reacts to
 * the cursor (nearby nodes nudge, lines brighten), and is fully reduced-motion
 * aware (renders a single static frame). Canvas 2D, DPR-aware, pauses offscreen
 * and when the tab is hidden. Decorative only (aria-hidden), never carries content.
 */
export function NetworkField({ className, density = 48 }: NetworkFieldProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Theme-aware colors pulled from CSS tokens (fallbacks for safety).
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#c75334";
    // Dark-only theme: light sage nodes/lines read well on the forest-green canvas.
    const nodeColor = "rgba(168,194,179,"; // brand-200 sage
    const lineColor = "rgba(168,194,179,";

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let running = true;

    const LINK_DIST = 130; // px within which nodes connect

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale node count to area, capped for performance (esp. mobile).
      const scaled = Math.round(density * Math.min(1, width / 1280));
      const count = Math.max(14, Math.min(scaled, 60));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 1,
      }));
      // A handful of travelling pulses between random node pairs.
      pulses = Array.from({ length: Math.max(3, Math.round(count / 8)) }, () => ({
        a: Math.floor(Math.random() * count),
        b: Math.floor(Math.random() * count),
        t: Math.random(),
        speed: Math.random() * 0.006 + 0.003,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Connections + cursor brightening.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DIST) continue;
          let alpha = (1 - dist / LINK_DIST) * 0.5;
          // Brighten lines near the pointer.
          if (pointer.active) {
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const pd = Math.hypot(mx - pointer.x, my - pointer.y);
            if (pd < 160) alpha += (1 - pd / 160) * 0.4;
          }
          ctx.strokeStyle = `${lineColor}${Math.min(alpha, 0.85).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Nodes.
      for (const n of nodes) {
        ctx.fillStyle = `${nodeColor}0.75)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Data pulses travelling along edges (brand accent).
      for (const p of pulses) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.fillStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        // Gentle magnetic nudge toward the pointer.
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 140 && d > 0.5) {
            n.x += (dx / d) * 0.25;
            n.y += (dy / d) * 0.25;
          }
        }
      }
      for (const p of pulses) {
        p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.a = Math.floor(Math.random() * nodes.length);
          p.b = Math.floor(Math.random() * nodes.length);
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const start = () => {
      if (raf || !running) return;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    build();

    if (prefersReduced) {
      // Static, equally-handsome single frame; no loop, no pointer reactivity.
      draw();
      return () => {};
    }

    // Pause when offscreen to save battery/CPU.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (running) start();
    };

    const onResize = () => {
      stop();
      build();
      start();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

export default NetworkField;
