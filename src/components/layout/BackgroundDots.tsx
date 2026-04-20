"use client";

import { useEffect, useRef } from "react";
import { useBackground } from "./BackgroundProvider";

const DOT_SPACING = 28;   // px between dots
const DOT_RADIUS  = 1;    // base dot radius
const BASE_ALPHA  = 0.12; // resting dot opacity
const GLOW_RADIUS = 16;  // px around cursor that illuminates dots
const GLOW_ALPHA  = 0.38; // max additional alpha at cursor centre
const AMBIENT_RADIUS = 240; // ambient halo radius around cursor
const AMBIENT_ALPHA_INNER = 0.018; // ambient halo opacity at centre
const AMBIENT_ALPHA_MID   = 0.006; // ambient halo opacity at mid-stop

export default function BackgroundDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useBackground();
  const settingsRef   = useRef(settings);
  // Keep ref in sync outside render to avoid stale closures in the RAF loop
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Only run cursor glow on pointer devices (not touch-only)
    const hasPointer = window.matchMedia("(pointer: fine)").matches;

    let animId: number;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!settingsRef.current.grid) {
        animId = requestAnimationFrame(draw);
        return;
      }

      const { x: mx, y: my } = mouseRef.current;
      const W    = canvas.width;
      const H    = canvas.height;
      const cols = Math.ceil(W / DOT_SPACING);
      const rows = Math.ceil(H / DOT_SPACING);

      // ── Pass 1: all base dots in a single batch ───────────────────────────
      ctx.fillStyle = `rgba(255,255,255,${BASE_ALPHA})`;
      ctx.beginPath();
      for (let r = 0; r <= rows; r++) {
        const y = r * DOT_SPACING;
        for (let c = 0; c <= cols; c++) {
          const x = c * DOT_SPACING;
          ctx.moveTo(x + DOT_RADIUS, y);
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      if (!hasPointer || mx < -100) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // ── Ambient white glow — tight radius, near-zero opacity, no hard edge ─
      // Uses a 3-stop gradient so the falloff is very gradual (no visible circle).
      const bgGrad = ctx.createRadialGradient(mx, my, 0, mx, my, AMBIENT_RADIUS);
      bgGrad.addColorStop(0,   `rgba(255,255,255,${AMBIENT_ALPHA_INNER})`);
      bgGrad.addColorStop(0.45,`rgba(255,255,255,${AMBIENT_ALPHA_MID})`);
      bgGrad.addColorStop(1,   "rgba(255,255,255,0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(
        Math.max(0, mx - AMBIENT_RADIUS),
        Math.max(0, my - AMBIENT_RADIUS),
        AMBIENT_RADIUS * 2,
        AMBIENT_RADIUS * 2,
      );

      // ── Pass 2: illuminate dots within glow radius (bounding-box scan) ────
      const minC = Math.max(0, Math.floor((mx - GLOW_RADIUS) / DOT_SPACING));
      const maxC = Math.min(cols, Math.ceil((mx + GLOW_RADIUS) / DOT_SPACING));
      const minR = Math.max(0, Math.floor((my - GLOW_RADIUS) / DOT_SPACING));
      const maxR = Math.min(rows, Math.ceil((my + GLOW_RADIUS) / DOT_SPACING));

      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          const x    = c * DOT_SPACING;
          const y    = r * DOT_SPACING;
          const dist = Math.hypot(mx - x, my - y);
          if (dist >= GLOW_RADIUS) continue;

          const t    = 1 - dist / GLOW_RADIUS;
          const glow = t * t; // quadratic falloff
          if (glow < 0.01) continue;

          ctx.fillStyle = `rgba(255,255,255,${BASE_ALPHA + glow * GLOW_ALPHA})`;
          ctx.beginPath();
          ctx.arc(x, y, DOT_RADIUS + glow * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animId = requestAnimationFrame(draw);
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    resize();
    animId = requestAnimationFrame(draw);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
