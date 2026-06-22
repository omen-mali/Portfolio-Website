"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradientText from "@/components/ui/GradientText";
import Typewriter from "@/components/ui/Typewriter";
import QuoteOverlay from "@/components/splash/QuoteOverlay";
import { experiences } from "@/content/experience";

const TYPEWRITER_PHRASES = [
  "Computer Systems Engineering",
  "Embedded & Real-Time Systems",
  "Application Software Development",
  "IT & Testing Platform Support",
];

const BADGE_EMBLEM_INTERVAL = 3000; // ms between sparkle ↔ Jedi emblem swap
const BADGE_EMBLEM_FADE = 0.6;      // crossfade duration (s)

export default function Hero() {
  const currentCoop = experiences.find((e) => e.current);
  const [badgeExpanded, setBadgeExpanded] = useState(false);
  // 0 = sparkle, 1 = Jedi Order emblem. Alternates on an interval.
  const [emblemIdx, setEmblemIdx] = useState(0);
  // Large emblem interior: true = gradient-filled, false = outline-only.
  // Auto-flipped every 2s while the badge is expanded; the opening
  // frame is seeded by `nextEmblemStart` at click time.
  const [emblemFilled, setEmblemFilled] = useState(false);
  // Seed for `emblemFilled` on the NEXT click. Flipped each click so
  // consecutive expansions open on alternating frames (outline, fill,
  // outline, ...).
  const [nextEmblemStart, setNextEmblemStart] = useState(false);
  const ringRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  // Once the expand settles, drop the container's `overflow:hidden` so the
  // emblem's radiant glow isn't clipped into a hard rectangle (top/bottom).
  // Re-clipped the instant we start collapsing so the height transition is clean.
  const [emblemOpen, setEmblemOpen] = useState(false);

  const handleBadgeClick = useCallback(() => {
    if (badgeExpanded) return;
    // Target `scrollY = 0` explicitly — `scrollIntoView("#hero")` can
    // stall a few pixels short because the emblem's height animation
    // shifts the layout during the scroll. A watchdog effect below
    // corrects any residual offset.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Seed `emblemFilled` BEFORE `badgeExpanded` so the outer
    // AnimatePresence mounts the emblem with the intended opening
    // value already in state — no crossfade on mount.
    setEmblemFilled(nextEmblemStart);
    setNextEmblemStart((s) => !s);
    setBadgeExpanded(true);
    // Hold the expanded state (and the large emblem) for 4s before collapsing.
    setTimeout(() => setBadgeExpanded(false), 4000);
  }, [badgeExpanded, nextEmblemStart]);

  // Scroll-settle watchdog — polls scrollY for up to 2s after a badge
  // click, snapping to 0 if the smooth scroll stalls short because
  // the emblem's concurrent height animation shifted the layout.
  // Exits after 3 consecutive stable frames at y ≤ 0.5.
  useEffect(() => {
    if (!badgeExpanded) return;
    let rafId = 0;
    let stableFrames = 0;
    const start = performance.now();
    const tick = () => {
      const y = window.scrollY;
      const elapsed = performance.now() - start;
      if (y <= 0.5) {
        stableFrames++;
        if (stableFrames >= 3) return;
      } else {
        stableFrames = 0;
        if (elapsed > 700) window.scrollTo(0, 0);
      }
      if (elapsed > 2000) return;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [badgeExpanded]);

  // Flip the large emblem between outline and fill every 2s while expanded.
  useEffect(() => {
    if (!badgeExpanded) return;
    const id = setInterval(() => setEmblemFilled((f) => !f), 2000);
    return () => clearInterval(id);
  }, [badgeExpanded]);

  // Reveal the glow (overflow:visible) only after the 0.5s expand settles;
  // re-clip immediately on collapse so the height animation stays contained.
  useEffect(() => {
    if (!badgeExpanded) {
      setEmblemOpen(false);
      return;
    }
    const t = setTimeout(() => setEmblemOpen(true), 540);
    return () => clearTimeout(t);
  }, [badgeExpanded]);

  // Alternate the badge emblem between the sparkle and the Jedi emblem.
  useEffect(() => {
    const id = setInterval(
      () => setEmblemIdx((i) => (i === 0 ? 1 : 0)),
      BADGE_EMBLEM_INTERVAL,
    );
    return () => clearInterval(id);
  }, []);

  // Animate the ring's dark stop between #4f46e5 (gap) and the bright stop
  // (joined). The bright stop matches the --grad-light token so it stays in
  // sync with the toned-down gradients (and the active theme).
  useEffect(() => {
    const el = ringRef?.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);

    const joining = badgeExpanded;
    // Join fast (snap shut on click); separate after scale-down finishes
    const duration  = joining ? 250 : 450;
    const startDelay = joining ? 0 : 700;

    // #4f46e5 (gap) ↔ --grad-light (joined). Parse the token to RGB; fall back
    // to the dark-mode default if it can't be read.
    const hexToRgb = (hex: string): [number, number, number] => {
      const h = hex.trim().replace("#", "");
      return [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16),
      ];
    };
    const gradLight =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--grad-light")
        .trim() || "#b6a0fc";
    const bright = hexToRgb(gradLight);

    const from = joining ? [79, 70, 229] : bright;
    const to   = joining ? bright : [79, 70, 229];

    let t0: number | null = null;
    function step(ts: number) {
      if (t0 === null) t0 = ts;
      const elapsed = ts - t0 - startDelay;
      if (elapsed < 0) { rafRef.current = requestAnimationFrame(step); return; }

      const p = Math.min(elapsed / duration, 1);
      // ease-out-cubic joining (snaps shut), ease-in-quad separating (starts gentle)
      const e = joining ? 1 - (1 - p) ** 3 : p * p;

      const r = Math.round(from[0] + (to[0] - from[0]) * e);
      const g = Math.round(from[1] + (to[1] - from[1]) * e);
      const b = Math.round(from[2] + (to[2] - from[2]) * e);
      el?.style.setProperty('--ring-dim', `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`);

      if (p < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [badgeExpanded]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl"
      >
        {/* Glowing badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <motion.span
            onClick={handleBadgeClick}
            className="glow-badge relative inline-flex rounded-full p-[2px] cursor-pointer select-none overflow-hidden isolate"
            animate={{ scale: badgeExpanded ? 1.1 : 1 }}
            whileHover={{ scale: badgeExpanded ? 1.1 : 1.04 }}
            transition={{
              scale: {
                duration: badgeExpanded ? 0.5 : 0.7,
                ease: badgeExpanded
                  ? [0.34, 1.56, 0.64, 1]
                  : [0.4, 0, 0.2, 1],
              },
            }}
          >
            {/* Single ring — dark stop (#4f46e5) animated via --ring-dim to close/open gap */}
            <span ref={ringRef} className="badge-ring-layer badge-ring-default" aria-hidden="true" />
            <span className="hero-badge relative z-[1] inline-flex items-center gap-2.5 rounded-full bg-[#0a0a0a] px-5 py-2 text-sm font-medium text-violet-400">
              {/* Emblem container — two stacked SVGs crossfading via opacity.
                  Bumped from 20px -> 24px so the detailed Jedi path (wings,
                  central saber, 8-point starburst) reads clearly at this size. */}
              <span className="relative inline-flex h-6 w-6 shrink-0">
                {/* Sparkle emblem — index 0 */}
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="absolute inset-0 h-full w-full text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  animate={{ opacity: emblemIdx === 0 ? 1 : 0 }}
                  transition={{ duration: BADGE_EMBLEM_FADE, ease: "easeInOut" }}
                >
                  <defs>
                    <linearGradient id="sparkle-grad-anim" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
                      <stop offset="0%" stopColor="#8b5cf6">
                        <animate attributeName="stop-color" values="#8b5cf6;#6366f1;#7c3aed;#8b5cf6" dur="4s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="50%" stopColor="#7c3aed">
                        <animate attributeName="stop-color" values="#7c3aed;#8b5cf6;#6366f1;#7c3aed" dur="4s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" stopColor="#6366f1">
                        <animate attributeName="stop-color" values="#6366f1;#7c3aed;#8b5cf6;#6366f1" dur="4s" repeatCount="indefinite" />
                      </stop>
                    </linearGradient>
                  </defs>
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" stroke="url(#sparkle-grad-anim)" />
                  <path d="M20 3v4" stroke="url(#sparkle-grad-anim)" />
                  <path d="M22 5h-4" stroke="url(#sparkle-grad-anim)" />
                  <path d="M4 17v2" stroke="url(#sparkle-grad-anim)" />
                  <path d="M5 18H3" stroke="url(#sparkle-grad-anim)" />
                </motion.svg>
                {/* Jedi Order emblem — index 1. Uses the real path + nested
                    transforms from Jedi_symbol.svg, so wings read as one
                    continuous piece beneath the hilt. Separate viewBox so the
                    gradient (gradientUnits=userSpaceOnUse, 590.6×600) spans
                    the full glyph. */}
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 590.60175 600"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                  animate={{ opacity: emblemIdx === 1 ? 1 : 0 }}
                  transition={{ duration: BADGE_EMBLEM_FADE, ease: "easeInOut" }}
                >
                  <defs>
                    <linearGradient
                      id="jedi-badge-grad"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2="590.60175"
                      y2="600"
                    >
                      <stop offset="0%" stopColor="#8b5cf6">
                        <animate attributeName="stop-color" values="#8b5cf6;#6366f1;#7c3aed;#8b5cf6" dur="4s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="50%" stopColor="#7c3aed">
                        <animate attributeName="stop-color" values="#7c3aed;#8b5cf6;#6366f1;#7c3aed" dur="4s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" stopColor="#6366f1">
                        <animate attributeName="stop-color" values="#6366f1;#7c3aed;#8b5cf6;#6366f1" dur="4s" repeatCount="indefinite" />
                      </stop>
                      {/* Rotate the gradient around the viewBox center to create
                          a moving gradient ring effect on both fill and stroke. */}
                      <animateTransform
                        attributeName="gradientTransform"
                        type="rotate"
                        from="0 295 300"
                        to="360 295 300"
                        dur="10s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>
                  </defs>
                  <g transform="matrix(1.25,0,0,-1.25,831.48097,645.41878)">
                    <g transform="matrix(2.5676375,0,0,-2.5676375,-860.6843,-186.96836)">
                      <path
                        fill="url(#jedi-badge-grad)"
                        fillRule="evenodd"
                        d="M 171.38577,-146.87499 C 173.42419,-149.84989 184.30064,-165.72444 184.30064,-165.72444 C 184.30064,-165.72444 176.01148,-142.92687 176.01148,-142.92687 C 176.01148,-142.92687 201.70967,-139.19518 201.70967,-139.19518 C 201.70967,-139.19518 176.01148,-135.4649 176.01148,-135.4649 C 176.01148,-135.4649 185.95925,-115.98313 185.95925,-115.98313 C 185.95925,-115.98313 173.54833,-129.03133 171.79458,-130.87454 C 172.51744,-102.62513 172.69532,-95.67241 172.69532,-95.67241 C 172.69532,-95.67241 236.11292,-125.10301 200.88072,-190.17991 C 200.88072,-190.17991 244.81796,-238.67709 205.02618,-268.5211 C 205.02618,-268.5211 273.00372,-227.48554 229.89613,-157.02046 C 229.89613,-157.02046 265.54245,-191.83746 246.89034,-227.07107 C 246.89034,-227.07107 279.22085,-181.47522 239.84355,-131.32014 C 239.84355,-131.32014 250.62062,-137.95316 260.15391,-163.23759 C 260.15391,-163.23759 253.19978,-87.965715 168.98591,-86.978323 C 168.98591,-86.968422 168.98591,-86.968422 168.98591,-86.968422 C 168.70511,-86.968422 168.42608,-86.968422 168.14635,-86.969841 C 167.86767,-86.968422 167.58759,-86.968422 167.3075,-86.968422 C 167.3075,-86.968422 167.3075,-86.968422 167.3075,-86.978323 C 83.093981,-87.965715 76.139847,-163.23759 76.139847,-163.23759 C 85.672786,-137.95316 96.449146,-131.32014 96.449146,-131.32014 C 57.07255,-181.47522 89.403065,-227.07107 89.403065,-227.07107 C 70.750247,-191.83746 106.39798,-157.02046 106.39798,-157.02046 C 63.289688,-227.48554 131.26651,-268.5211 131.26651,-268.5211 C 91.475437,-238.67709 135.41268,-190.17991 135.41268,-190.17991 C 100.18085,-125.10301 163.59843,-95.67241 163.59843,-95.67241 C 163.59843,-95.67241 163.77525,-102.62513 164.49811,-130.87454 C 162.74402,-129.03133 150.3338,-115.98313 150.3338,-115.98313 C 150.3338,-115.98313 160.28121,-135.4649 160.28121,-135.4649 C 160.28121,-135.4649 134.58373,-139.19518 134.58373,-139.19518 C 134.58373,-139.19518 160.28121,-142.92687 160.28121,-142.92687 C 160.28121,-142.92687 151.99312,-165.72444 151.99312,-165.72444 C 151.99312,-165.72444 162.8685,-149.84989 164.90693,-146.87499 C 165.83066,-182.95842 168.12088,-272.48974 168.1322,-272.91235 C 168.13645,-273.90504 168.13645,-273.9107 168.13645,-273.9107 C 168.13645,-273.9107 168.13645,-273.90964 168.14635,-273.49799 C 168.15731,-273.90964 168.15731,-273.9107 168.15731,-273.9107 C 168.15731,-273.9107 168.15731,-273.90504 168.16156,-272.91235 C 168.17995,-272.20612 170.46451,-182.87637 171.38577,-146.87499 C 171.38577,-146.87499 171.38577,-146.87499 171.38577,-146.87499 z"
                      />
                    </g>
                  </g>
                </motion.svg>
              </span>
              Trust in the Force
            </span>
          </motion.span>
        </motion.div>

        {/* Large Jedi emblem — slots in below the badge while expanded. */}
        <AnimatePresence initial={false}>
          {badgeExpanded && (
            <motion.div
              key="jedi-large-emblem"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ overflow: emblemOpen ? "visible" : "hidden" }}
            >
              <div className="flex justify-center pb-6">
                {/* `overflow="visible"` prevents the non-scaling 3px stroke
                    from being clipped at the viewBox edge. */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 590.60175 600"
                  overflow="visible"
                  className="jedi-emblem-glow h-40 w-40 md:h-56 md:w-56"
                  aria-hidden="true"
                >
                  <defs>
                    {/* Shared path — rendered twice via <use> below (fill +
                        outline). No `fill` here: a presentation attribute
                        on the referenced element overrides the <use>'s
                        own, so each <use> sets its own fill explicitly. */}
                    <path
                      id="jedi-emblem-path"
                      d="M 171.38577,-146.87499 C 173.42419,-149.84989 184.30064,-165.72444 184.30064,-165.72444 C 184.30064,-165.72444 176.01148,-142.92687 176.01148,-142.92687 C 176.01148,-142.92687 201.70967,-139.19518 201.70967,-139.19518 C 201.70967,-139.19518 176.01148,-135.4649 176.01148,-135.4649 C 176.01148,-135.4649 185.95925,-115.98313 185.95925,-115.98313 C 185.95925,-115.98313 173.54833,-129.03133 171.79458,-130.87454 C 172.51744,-102.62513 172.69532,-95.67241 172.69532,-95.67241 C 172.69532,-95.67241 236.11292,-125.10301 200.88072,-190.17991 C 200.88072,-190.17991 244.81796,-238.67709 205.02618,-268.5211 C 205.02618,-268.5211 273.00372,-227.48554 229.89613,-157.02046 C 229.89613,-157.02046 265.54245,-191.83746 246.89034,-227.07107 C 246.89034,-227.07107 279.22085,-181.47522 239.84355,-131.32014 C 239.84355,-131.32014 250.62062,-137.95316 260.15391,-163.23759 C 260.15391,-163.23759 253.19978,-87.965715 168.98591,-86.978323 C 168.98591,-86.968422 168.98591,-86.968422 168.98591,-86.968422 C 168.70511,-86.968422 168.42608,-86.968422 168.14635,-86.969841 C 167.86767,-86.968422 167.58759,-86.968422 167.3075,-86.968422 C 167.3075,-86.968422 167.3075,-86.968422 167.3075,-86.978323 C 83.093981,-87.965715 76.139847,-163.23759 76.139847,-163.23759 C 85.672786,-137.95316 96.449146,-131.32014 96.449146,-131.32014 C 57.07255,-181.47522 89.403065,-227.07107 89.403065,-227.07107 C 70.750247,-191.83746 106.39798,-157.02046 106.39798,-157.02046 C 63.289688,-227.48554 131.26651,-268.5211 131.26651,-268.5211 C 91.475437,-238.67709 135.41268,-190.17991 135.41268,-190.17991 C 100.18085,-125.10301 163.59843,-95.67241 163.59843,-95.67241 C 163.59843,-95.67241 163.77525,-102.62513 164.49811,-130.87454 C 162.74402,-129.03133 150.3338,-115.98313 150.3338,-115.98313 C 150.3338,-115.98313 160.28121,-135.4649 160.28121,-135.4649 C 160.28121,-135.4649 134.58373,-139.19518 134.58373,-139.19518 C 134.58373,-139.19518 160.28121,-142.92687 160.28121,-142.92687 C 160.28121,-142.92687 151.99312,-165.72444 151.99312,-165.72444 C 151.99312,-165.72444 162.8685,-149.84989 164.90693,-146.87499 C 165.83066,-182.95842 168.12088,-272.48974 168.1322,-272.91235 C 168.13645,-273.90504 168.13645,-273.9107 168.13645,-273.9107 C 168.13645,-273.9107 168.13645,-273.90964 168.14635,-273.49799 C 168.15731,-273.90964 168.15731,-273.9107 168.15731,-273.9107 C 168.15731,-273.9107 168.15731,-273.90504 168.16156,-272.91235 C 168.17995,-272.20612 170.46451,-182.87637 171.38577,-146.87499 C 171.38577,-146.87499 171.38577,-146.87499 171.38577,-146.87499 z"
                    />
                    {/* Shared gradient — mirrors `jedi-badge-grad` so the
                        large emblem reads as a scaled-up badge glyph.
                        Color-animated stops on a 4s loop + 10s rotation. */}
                    <linearGradient
                      id="jedi-emblem-grad"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2="590.60175"
                      y2="600"
                    >
                      <stop offset="0%" stopColor="#8b5cf6">
                        <animate attributeName="stop-color" values="#8b5cf6;#6366f1;#7c3aed;#8b5cf6" dur="4s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="50%" stopColor="#7c3aed">
                        <animate attributeName="stop-color" values="#7c3aed;#8b5cf6;#6366f1;#7c3aed" dur="4s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" stopColor="#6366f1">
                        <animate attributeName="stop-color" values="#6366f1;#7c3aed;#8b5cf6;#6366f1" dur="4s" repeatCount="indefinite" />
                      </stop>
                      <animateTransform
                        attributeName="gradientTransform"
                        type="rotate"
                        from="0 295 300"
                        to="360 295 300"
                        dur="10s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>
                  </defs>
                  <g transform="matrix(1.25,0,0,-1.25,831.48097,645.41878)">
                    <g transform="matrix(2.5676375,0,0,-2.5676375,-860.6843,-186.96836)">
                      {/* Gradient fill — mounted only when `emblemFilled`
                          is true. `fillRule="evenodd"` gives the hollow
                          interior shapes. 400ms crossfade. */}
                      <AnimatePresence initial={false}>
                        {emblemFilled && (
                          <motion.g
                            key="jedi-large-emblem-fill"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                          >
                            <use
                              href="#jedi-emblem-path"
                              fill="url(#jedi-emblem-grad)"
                              fillRule="evenodd"
                            />
                          </motion.g>
                        )}
                      </AnimatePresence>
                      {/* Gradient outline — opacity is the inverse of the
                          fill, so the two crossfade on the same 400ms.
                          `initial` must be set (Framer reads undefined
                          from a bare <g>, throwing "animate from
                          undefined") and must mirror `animate` so
                          fill-first mounts don't flash the outline. */}
                      <motion.g
                        initial={{ opacity: emblemFilled ? 0 : 1 }}
                        animate={{ opacity: emblemFilled ? 0 : 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <use
                          href="#jedi-emblem-path"
                          fill="none"
                          stroke="url(#jedi-emblem-grad)"
                          strokeWidth="3"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </motion.g>
                    </g>
                  </g>
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <GradientText
          as="h1"
          breathe
          className="text-5xl font-bold tracking-tight md:text-7xl"
        >
          Momen Ali
        </GradientText>

        {/* Typewriter subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mx-auto mt-4 h-8 max-w-xl"
        >
          <Typewriter
            phrases={TYPEWRITER_PHRASES}
            className="font-mono text-lg text-muted md:text-xl"
          />
        </motion.div>

        {/* Status chips — education + current co-op */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2.5"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3.5 py-1.5 text-xs text-muted">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 10L12 5 2 10l10 5 10-5z" />
              <path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" />
            </svg>
            Carleton University · Computer Systems Engineering
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3.5 py-1.5 text-xs font-medium text-violet-300">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Co-op @ {currentCoop?.company ?? "Open to opportunities"}
          </span>
        </motion.div>

        {/* CTA + quick links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#showcase"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
          >
            View Showcase
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-muted hover:bg-white/5"
          >
            Resume
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-muted hover:bg-white/5"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Social quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-5 flex items-center justify-center gap-6"
        >
          <a
            href="https://github.com/omen-mali"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted transition-colors hover:text-foreground"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/momen-m-ali/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted transition-colors hover:text-foreground"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a
            href="mailto:momen.musa.ali@gmail.com"
            aria-label="Email"
            className="text-muted transition-colors hover:text-foreground"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M22 7l-10 7L2 7"/>
            </svg>
          </a>
        </motion.div>

        {/* Quote overlay buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <QuoteOverlay />
        </motion.div>
      </motion.div>

      {/* Scroll indicator — click scrolls to About */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 cursor-pointer"
        role="button"
        aria-label="Scroll to About section"
        tabIndex={0}
        onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
        onKeyDown={(e) => e.key === "Enter" && document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-muted"
          >
            <path
              d="M8 3v10M4 9l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
