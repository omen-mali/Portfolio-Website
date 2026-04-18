"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const COLORS = [
  "rgba(139, 92, 246,",   // violet-500
  "rgba(99, 102, 241,",   // indigo-500
  "rgba(167, 139, 250,",  // violet-400
];

/**
 * @param direction - "radial" (default): particles drift outward in all directions.
 *                    "up": particles drift upward (bottom-to-top).
 */
export default function IconParticles({ size = 60, direction = "radial" }: { size?: number; direction?: "radial" | "up" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const pad = 20; // extra space around icon for particles
    const w = size + pad * 2;
    const h = size + pad * 2;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const radius = size / 2 + 4;

    const particles: Particle[] = [];
    let animId: number;

    function spawn() {
      const angle = Math.random() * Math.PI * 2;
      const dist = radius + Math.random() * 3; // tighter spawn band
      const spawnX = cx + Math.cos(angle) * dist;
      const spawnY = cy + Math.sin(angle) * dist;

      // "up" mode: particles drift upward; "radial" mode: drift outward
      const vx = direction === "up"
        ? (Math.random() - 0.5) * 0.2
        : Math.cos(angle) * (0.06 + Math.random() * 0.1);
      const vy = direction === "up"
        ? -(0.15 + Math.random() * 0.25)
        : Math.sin(angle) * (0.06 + Math.random() * 0.1);

      particles.push({
        x: spawnX,
        y: spawnY,
        vx,
        vy,
        life: 0,
        maxLife: 35 + Math.random() * 30,
        size: 1 + Math.random() * 1.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // spawn ~1 particle per 4 frames
      if (Math.random() < 0.25) spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        // fade in then out
        const alpha = progress < 0.2
          ? progress / 0.2
          : 1 - (progress - 0.2) / 0.8;
        const opacity = Math.max(0, alpha * 0.6);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [size, direction]);

  const pad = 20;
  const w = size + pad * 2;
  const h = size + pad * 2;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute"
      style={{
        top: `${-pad}px`,
        left: `${-pad}px`,
        width: `${w}px`,
        height: `${h}px`,
      }}
      aria-hidden="true"
    />
  );
}
