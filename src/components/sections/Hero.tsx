"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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

export default function Hero() {
  const [badgeExpanded, setBadgeExpanded] = useState(false);
  const ringRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  const handleBadgeClick = useCallback(() => {
    if (badgeExpanded) return;
    setBadgeExpanded(true);
    setTimeout(() => setBadgeExpanded(false), 2000);
  }, [badgeExpanded]);

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
          transition={{ delay: 0.1, duration: 0.5 }}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-violet-400"
              >
                <defs>
                  <linearGradient id="sparkle-grad-anim" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="#c4b5fd">
                      <animate attributeName="stopColor" values="#c4b5fd;#6366f1;#7c3aed;#c4b5fd" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#7c3aed">
                      <animate attributeName="stopColor" values="#7c3aed;#c4b5fd;#6366f1;#7c3aed" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#6366f1">
                      <animate attributeName="stopColor" values="#6366f1;#7c3aed;#c4b5fd;#6366f1" dur="4s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>
                </defs>
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" stroke="url(#sparkle-grad-anim)" />
                <path d="M20 3v4" stroke="url(#sparkle-grad-anim)" />
                <path d="M22 5h-4" stroke="url(#sparkle-grad-anim)" />
                <path d="M4 17v2" stroke="url(#sparkle-grad-anim)" />
                <path d="M5 18H3" stroke="url(#sparkle-grad-anim)" />
              </svg>
              Trust in the Force
            </span>
          </motion.span>
        </motion.div>

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
