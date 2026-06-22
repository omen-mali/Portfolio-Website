"use client";

import { useEffect, useRef } from "react";
import { useBackground } from "./BackgroundProvider";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  life: number;     // current lifetime (counts down)
  maxLife: number;  // total lifetime in frames
}

const STAR_COUNT = 150;
// Average one shooting star every ~6 seconds at 60fps
const SHOOTING_STAR_CHANCE = 1 / 360;
const MAX_SHOOTING_STARS = 4;

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useBackground();
  const settingsRef = useRef(settings);
  // Keep ref in sync outside render to avoid stale closures in the RAF loop
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion: the starfield is pure decoration, so leave the
    // canvas blank rather than running a perpetual animation loop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];
    // RGB triplet for stars — white on the dark theme, dark slate in light mode
    // (white stars are invisible on the light background). Refreshed each frame.
    let starRgb = "255, 255, 255";

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initStars() {
      if (!canvas) return;
      const count = window.innerWidth < 768 ? Math.floor(STAR_COUNT / 2) : STAR_COUNT;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.15 + 0.02,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    }

    function spawnShootingStar() {
      if (!canvas) return;
      // Start from a random point along the top or left edge
      const fromTop = Math.random() > 0.4;
      const x = fromTop
        ? Math.random() * canvas.width
        : -20;
      const y = fromTop
        ? -20
        : Math.random() * canvas.height * 0.5;

      // Angle: roughly 30-60 degrees downward-right
      const angle = (Math.PI / 180) * (25 + Math.random() * 30);
      const speed = 8 + Math.random() * 8;

      const maxLife = 40 + Math.random() * 30;

      shootingStars.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 80 + Math.random() * 80,
        opacity: 0.7 + Math.random() * 0.3,
        life: maxLife,
        maxLife,
      });
    }

    function drawShootingStars() {
      if (!ctx || !canvas) return;

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];

        // Fade in for first 20% of life, fade out for last 40%
        const progress = s.life / s.maxLife;
        let alpha: number;
        if (progress > 0.8) {
          alpha = s.opacity * ((1 - progress) / 0.2); // fade in
        } else if (progress < 0.4) {
          alpha = s.opacity * (progress / 0.4);        // fade out
        } else {
          alpha = s.opacity;
        }

        // Tail: gradient line from head to tail
        const tailX = s.x - s.vx * (s.length / (Math.abs(s.vx) + Math.abs(s.vy)));
        const tailY = s.y - s.vy * (s.length / (Math.abs(s.vx) + Math.abs(s.vy)));

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(${starRgb}, 0)`);
        grad.addColorStop(1, `rgba(${starRgb}, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Bright head dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starRgb}, ${alpha})`;
        ctx.fill();

        // Advance
        s.x += s.vx;
        s.y += s.vy;
        s.life--;

        // Remove when done or off-screen
        if (
          s.life <= 0 ||
          s.x > canvas.width + 50 ||
          s.y > canvas.height + 50
        ) {
          shootingStars.splice(i, 1);
        }
      }
    }

    function draw(time: number) {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bg = settingsRef.current;
      starRgb = document.documentElement.classList.contains("light")
        ? "63, 63, 70"
        : "255, 255, 255";

      // Maybe spawn a shooting star
      if (
        bg.shooting &&
        shootingStars.length < MAX_SHOOTING_STARS &&
        Math.random() < SHOOTING_STAR_CHANCE
      ) {
        spawnShootingStar();
      }

      // Draw background stars
      if (!bg.stars) {
        // Still advance animation frame but skip drawing
        if (bg.shooting) drawShootingStars();
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = `rgb(${starRgb})`;
      for (const star of stars) {
        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        ctx.globalAlpha = star.opacity * twinkle;

        star.y -= star.speed;
        if (star.y < -2) {
          star.y = canvas.height + 2;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw shooting stars on top
      if (bg.shooting) drawShootingStars();

      animationId = requestAnimationFrame(draw);
    }

    resize();
    initStars();
    animationId = requestAnimationFrame(draw);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); initStars(); }, 150);
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animationId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationId);
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
