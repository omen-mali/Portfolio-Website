"use client";

import { useEffect, useRef } from "react";
import { useBackground } from "./BackgroundProvider";

interface WarpStar {
  angle: number;
  dist: number;
  baseSpeed: number;
  brightness: number;
  size: number;
}

const STAR_COUNT = 240;

// Burst state machine timing (at 60 fps)
const RISE_RATE   = 0.006; // ~2.8 s rise
const HOLD_FRAMES = 120;   // ~2.0 s hold
const FALL_RATE   = 0.004; // ~4.2 s fall

type BurstState = "idle" | "rising" | "holding" | "falling";

export default function HyperspaceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useBackground();
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Hyperspace bursts are intense motion — skip entirely under reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let stars: WarpStar[] = [];
    let lastBurst    = -Infinity;
    let burstPhase   = 0;
    let burstState: BurstState = "idle";
    let holdFrames   = 0;

    const maxDist = () => Math.hypot(canvas.width, canvas.height) * 0.55;
    const minDist = () => maxDist() * 0.15; // centre void

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initStars() {
      if (!canvas) return;
      const mx = maxDist();
      const mn = minDist();
      stars = Array.from({ length: STAR_COUNT }, () => {
        const r = Math.random();
        const size =
          r < 0.08 ? 1.4 + Math.random() * 1.0   // 8 % bright/large
        : r < 0.35 ? 0.7 + Math.random() * 0.7   // 27 % medium
        :             0.3 + Math.random() * 0.4;  // 65 % small/dim
        return {
          angle:      Math.random() * Math.PI * 2,
          dist:       mn + Math.random() * (mx - mn),
          baseSpeed:  0.5 + Math.random() * 1.8,
          brightness: 0.35 + Math.random() * 0.65,
          size,
        };
      });
    }

    function draw(time: number) {
      if (!ctx || !canvas) return;
      const bg = settingsRef.current;

      // Fix: clear and idle when hyperspace is off
      if (!bg.hyperspace) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        burstState = "idle";
        burstPhase = 0;
        lastBurst  = -Infinity;
        animId = requestAnimationFrame(draw);
        return;
      }

      const speedMult   = bg.hyperspaceSpeed / 5;
      const intervalMs  = bg.hyperspaceInterval * 1000;
      const mx          = maxDist();
      const mn          = minDist();
      const cx          = canvas.width  / 2;
      const cy          = canvas.height / 2;

      // --- Burst state machine ---
      if (burstState === "idle" && time - lastBurst > intervalMs) {
        burstState = "rising";
        lastBurst  = time;
      }
      if (burstState === "rising") {
        burstPhase = Math.min(1, burstPhase + RISE_RATE);
        if (burstPhase >= 1) { burstState = "holding"; holdFrames = 0; }
      } else if (burstState === "holding") {
        if (++holdFrames >= HOLD_FRAMES) burstState = "falling";
      } else if (burstState === "falling") {
        burstPhase = Math.max(0, burstPhase - FALL_RATE);
        if (burstPhase <= 0) burstState = "idle";
      }

      // Smooth ease-in-out on burstPhase for visuals
      const e = burstPhase < 0.5
        ? 2 * burstPhase * burstPhase
        : 1 - Math.pow(-2 * burstPhase + 2, 2) / 2;

      const burstMult = 1 + e * 8;

      // Trail fade: soft in base (subtle trails), slightly lighter in burst (longer streaks)
      const fadeAlpha = 0.22 - e * 0.09;
      ctx.fillStyle = `rgba(10, 10, 10, ${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Colour: cool blue-white throughout (white/grey, no yellow tint)
      const colR = 210;
      const colG = 220;
      const colB = 240;

      for (const star of stars) {
        const frameSpeed = star.baseSpeed * speedMult * burstMult;
        const prevDist   = star.dist;
        star.dist += frameSpeed;

        if (star.dist > mx) {
          // Reset just outside the void so it streams in again
          star.dist  = mn + Math.random() * mn * 0.4;
          star.angle = Math.random() * Math.PI * 2;
          continue;
        }

        // Fade in gradually from void edge — full brightness toward outer half
        const fadeIn  = Math.min(1, (star.dist - mn) / (mx * 0.45));
        // Fade out near max edge
        const fadeOut = Math.max(0, 1 - Math.max(0, star.dist - mx * 0.82) / (mx * 0.18));
        const alpha   = fadeIn * fadeOut * star.brightness;
        if (alpha <= 0) continue;

        // During burst: inner trails more transparent, outer trails full opacity (outward gradient)
        const distNorm    = Math.min(1, (star.dist - mn) / (mx - mn)); // 0=void edge, 1=screen edge
        const radialFactor = 1 - e * (1 - distNorm);
        const trailAlpha  = alpha * radialFactor;

        const x = cx + Math.cos(star.angle) * star.dist;
        const y = cy + Math.sin(star.angle) * star.dist;

        // Streak tail: near-zero in base (→ dot), long in burst
        const streakE    = e * e; // extra ease for streak growth
        const streakLen  = frameSpeed * (0.2 + streakE * 6);
        const tailDist   = Math.max(mn, prevDist - streakLen);
        const tx = cx + Math.cos(star.angle) * tailDist;
        const ty = cy + Math.sin(star.angle) * tailDist;

        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, `rgba(${colR}, ${colG}, ${colB}, 0)`);
        grad.addColorStop(1, `rgba(${colR}, ${colG}, ${colB}, ${trailAlpha})`);

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = star.size * (1 + streakE * 0.4);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    initStars();
    animId = requestAnimationFrame(draw);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); initStars(); }, 150);
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animId = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
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
