"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradientText from "@/components/ui/GradientText";
import Typewriter from "@/components/ui/Typewriter";
import QuoteOverlay from "@/components/splash/QuoteOverlay";

const TYPEWRITER_PHRASES = [
  "Computer Systems Engineering",
  "Embedded Systems & Software",
  "C# .NET Development",
  "QNX Neutrino RTOS",
];

const QUICK_SKILLS = [
  "Computer Systems",
  "Software Engineering",
  "Embedded Platforms",
  "Real-Time Operating Systems",
];

const BADGE_EMBLEM_INTERVAL = 3000; // ms between sparkle ↔ Jedi emblem swap
const BADGE_EMBLEM_FADE = 0.6;      // crossfade duration (s)

export default function Hero() {
  const [badgeExpanded, setBadgeExpanded] = useState(false);
  const [emblemIdx, setEmblemIdx] = useState(0);
  const ringRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  const handleBadgeClick = useCallback(() => {
    if (badgeExpanded) return;
    // Snap the page to the top *instantly* (not smooth) so the emblem's
    // expansion happens at a known scroll position. A smooth scroll would
    // race the height animation and leave the badge mid-screen.
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    setBadgeExpanded(true);
    // Hold the expanded state (and the large emblem) for 4s before collapsing.
    setTimeout(() => setBadgeExpanded(false), 4000);
  }, [badgeExpanded]);

  // While the badge is expanded, hard-pin the scroll position to the top.
  // The emblem's reveal/collapse changes the page's height and the hero's
  // centered flex layout, both of which can otherwise nudge the viewport
  // off the top mid-animation. A rAF loop snaps `scrollY` back to 0 every
  // frame for the full 4s expanded window, accounting for the emblem's
  // distance below the badge as it pushes the title down.
  useEffect(() => {
    if (!badgeExpanded) return;
    let rafId = 0;
    const pin = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
      rafId = requestAnimationFrame(pin);
    };
    rafId = requestAnimationFrame(pin);
    return () => cancelAnimationFrame(rafId);
  }, [badgeExpanded]);

  useEffect(() => {
    const id = setInterval(
      () => setEmblemIdx((i) => (i === 0 ? 1 : 0)),
      BADGE_EMBLEM_INTERVAL,
    );
    return () => clearInterval(id);
  }, []);

  // Animate the ring's dark stop between #4f46e5 (gap) and #c4b5fd (joined)
  useEffect(() => {
    const el = ringRef?.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);

    const joining = badgeExpanded;
    // Join fast (snap shut on click); separate after scale-down finishes
    const duration  = joining ? 250 : 450;
    const startDelay = joining ? 0 : 700;

    // #4f46e5 ↔ #c4b5fd
    const from = joining ? [79, 70, 229] : [196, 181, 253];
    const to   = joining ? [196, 181, 253] : [79, 70, 229];

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
            <span className="relative z-[1] inline-flex items-center gap-2.5 rounded-full bg-[#0a0a0a] px-5 py-2 text-sm font-medium text-violet-400">
              <span className="relative inline-flex h-6 w-6 shrink-0">
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

        {/* Large Jedi Order emblem — slots in below the badge while it's
            expanded, pushing the title and subsequent elements down. The
            wrapper animates its `height` from 0 → auto so other elements
            shift smoothly; on exit it collapses back, keeping the layout
            in sync with the badge's expand/contract cycle. The emblem is
            outline-only with a rotating gradient stroke (no fill) and a
            violet glow — visually mirroring the badge ring without its
            splitting effect. */}
        <AnimatePresence initial={false}>
          {badgeExpanded && (
            <motion.div
              key="jedi-large-emblem"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ overflow: "hidden" }}
              aria-hidden="true"
            >
              <div className="flex justify-center pb-6">
                {/* `overflow="visible"` is required because the path's bottom
                    wings sit right at viewBox y=600, and `vectorEffect=
                    "non-scaling-stroke"` paints a constant 3px stroke whose
                    lower half would otherwise be clipped at the viewBox
                    edge — making the rounded wings look flat. */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 590.60175 600"
                  overflow="visible"
                  className="jedi-emblem-glow h-40 w-40 md:h-56 md:w-56"
                >
                  <defs>
                    {/* Wave-pattern gradient stops (light → dark → light) +
                        rotation give the path stroke the same shimmering
                        sweep the ring backdrop used to provide. No SMIL stop
                        cycling — the rotation alone carries the effect. */}
                    <linearGradient
                      id="jedi-emblem-grad"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2="590.60175"
                      y2="600"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="25%" stopColor="#7c3aed" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="75%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                      {/* LARGE EMBLEM GRADIENT SPEED — `dur` controls how
                          fast the stroke's shimmer sweeps around the crest.
                          One full rotation per `dur`. Larger = slower. */}
                      <animateTransform
                        attributeName="gradientTransform"
                        type="rotate"
                        from="0 295 300"
                        to="360 295 300"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>
                  </defs>
                  <g transform="matrix(1.25,0,0,-1.25,831.48097,645.41878)">
                    <g transform="matrix(2.5676375,0,0,-2.5676375,-860.6843,-186.96836)">
                      <path
                        fill="none"
                        fillRule="evenodd"
                        stroke="url(#jedi-emblem-grad)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        d="M 171.38577,-146.87499 C 173.42419,-149.84989 184.30064,-165.72444 184.30064,-165.72444 C 184.30064,-165.72444 176.01148,-142.92687 176.01148,-142.92687 C 176.01148,-142.92687 201.70967,-139.19518 201.70967,-139.19518 C 201.70967,-139.19518 176.01148,-135.4649 176.01148,-135.4649 C 176.01148,-135.4649 185.95925,-115.98313 185.95925,-115.98313 C 185.95925,-115.98313 173.54833,-129.03133 171.79458,-130.87454 C 172.51744,-102.62513 172.69532,-95.67241 172.69532,-95.67241 C 172.69532,-95.67241 236.11292,-125.10301 200.88072,-190.17991 C 200.88072,-190.17991 244.81796,-238.67709 205.02618,-268.5211 C 205.02618,-268.5211 273.00372,-227.48554 229.89613,-157.02046 C 229.89613,-157.02046 265.54245,-191.83746 246.89034,-227.07107 C 246.89034,-227.07107 279.22085,-181.47522 239.84355,-131.32014 C 239.84355,-131.32014 250.62062,-137.95316 260.15391,-163.23759 C 260.15391,-163.23759 253.19978,-87.965715 168.98591,-86.978323 C 168.98591,-86.968422 168.98591,-86.968422 168.98591,-86.968422 C 168.70511,-86.968422 168.42608,-86.968422 168.14635,-86.969841 C 167.86767,-86.968422 167.58759,-86.968422 167.3075,-86.968422 C 167.3075,-86.968422 167.3075,-86.968422 167.3075,-86.978323 C 83.093981,-87.965715 76.139847,-163.23759 76.139847,-163.23759 C 85.672786,-137.95316 96.449146,-131.32014 96.449146,-131.32014 C 57.07255,-181.47522 89.403065,-227.07107 89.403065,-227.07107 C 70.750247,-191.83746 106.39798,-157.02046 106.39798,-157.02046 C 63.289688,-227.48554 131.26651,-268.5211 131.26651,-268.5211 C 91.475437,-238.67709 135.41268,-190.17991 135.41268,-190.17991 C 100.18085,-125.10301 163.59843,-95.67241 163.59843,-95.67241 C 163.59843,-95.67241 163.77525,-102.62513 164.49811,-130.87454 C 162.74402,-129.03133 150.3338,-115.98313 150.3338,-115.98313 C 150.3338,-115.98313 160.28121,-135.4649 160.28121,-135.4649 C 160.28121,-135.4649 134.58373,-139.19518 134.58373,-139.19518 C 134.58373,-139.19518 160.28121,-142.92687 160.28121,-142.92687 C 160.28121,-142.92687 151.99312,-165.72444 151.99312,-165.72444 C 151.99312,-165.72444 162.8685,-149.84989 164.90693,-146.87499 C 165.83066,-182.95842 168.12088,-272.48974 168.1322,-272.91235 C 168.13645,-273.90504 168.13645,-273.9107 168.13645,-273.9107 C 168.13645,-273.9107 168.13645,-273.90964 168.14635,-273.49799 C 168.15731,-273.90964 168.15731,-273.9107 168.15731,-273.9107 C 168.15731,-273.9107 168.15731,-273.90504 168.16156,-272.91235 C 168.17995,-272.20612 170.46451,-182.87637 171.38577,-146.87499 C 171.38577,-146.87499 171.38577,-146.87499 171.38577,-146.87499 z"
                      />
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

        {/* Quick skill stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          {QUICK_SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-border bg-white/5 px-3 py-1 text-xs text-muted"
            >
              {skill}
            </span>
          ))}
        </motion.div>

        {/* CTA + quick links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#showcase"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
          >
            View Showcase
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
          className="mt-6 flex items-center justify-center gap-5"
        >
          <a
            href="https://github.com/omen-mali"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted transition-colors hover:text-foreground"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a
            href="mailto:momen.musa.ali@gmail.com"
            aria-label="Email"
            className="text-muted transition-colors hover:text-foreground"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
