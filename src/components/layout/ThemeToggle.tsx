"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import JediEmblem from "@/components/ui/JediEmblem";

// How long the warning stays "acknowledged" before it re-arms (dark → light).
const WARN_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
// The very first dark → light switch is delayed by this dramatic pause. It
// happens only once (persisted) — never again until the cache is cleared.
const FIRST_SWITCH_DELAY_MS = 1500;
// The warning popup lingers this long unless the user clicks away.
const POPUP_DURATION_MS = 30 * 1000;

// Persisted keys: last-warning timestamp (so a plain refresh doesn't re-arm the
// warning) and a one-time flag marking that the dramatic delay has been served.
const WARNED_AT_KEY = "themeWarnedAt";
const DELAY_DONE_KEY = "themeDelayDone";

// View Transitions API handle (typed loosely — not in every TS dom lib yet).
type VTDocument = Document & {
  startViewTransition?: (cb: () => void) => unknown;
};

const moon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const sun = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  const [popup, setPopup] = useState(false);
  const [flash, setFlash] = useState(false); // shows the Jedi emblem mid-transition
  const popupRef = useRef<HTMLDivElement>(null);
  const popupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore only the chosen theme (the warning intentionally does not persist).
  useEffect(() => {
    const isLight = localStorage.getItem("themeLight") === "1";
    setLight(isLight);
    document.documentElement.classList.toggle("light", isLight);
  }, []);

  useEffect(
    () => () => {
      if (popupTimer.current) clearTimeout(popupTimer.current);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      if (switchTimer.current) clearTimeout(switchTimer.current);
    },
    [],
  );

  // Click-away dismisses the warning. Clicks ON the warning are ignored — they
  // neither dismiss it nor disturb the pending 3s switch.
  useEffect(() => {
    if (!popup) return;
    const onPointerDown = (e: PointerEvent) => {
      if (popupRef.current?.contains(e.target as Node)) return;
      setPopup(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [popup]);

  function applyTheme(next: boolean) {
    setFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(false), 600);

    const root = document.documentElement;
    const commit = () => root.classList.toggle("light", next);

    // Cross-fade via the View Transitions API — GPU-composited, so it stays
    // smooth without the cost of transitioning every node. Falls back to an
    // instant switch when unsupported or under reduced motion.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const startViewTransition = (document as VTDocument).startViewTransition;
    if (!reduceMotion && typeof startViewTransition === "function") {
      startViewTransition.call(document, commit);
    } else {
      commit();
    }

    setLight(next);
    localStorage.setItem("themeLight", next ? "1" : "0");
  }

  function handleClick() {
    // Already in light mode → quietly return to the dark side. Never warn.
    if (light) {
      if (switchTimer.current) clearTimeout(switchTimer.current);
      applyTheme(false);
      return;
    }

    // In dark mode → decide whether to (a) show the warning and (b) delay the
    // switch, reading persisted state so a plain refresh changes nothing.
    const now = Date.now();
    let warnedAt: number | null = null;
    let delayDone = false;
    try {
      const stored = localStorage.getItem(WARNED_AT_KEY);
      warnedAt = stored ? Number(stored) : null;
      delayDone = localStorage.getItem(DELAY_DONE_KEY) === "1";
    } catch {
      /* localStorage unavailable — treat as a fresh, un-warned state */
    }

    // The warning re-arms only when it's never been shown, or 30+ min have
    // passed since it last was (NOT on a simple refresh — the timestamp persists).
    const armed = warnedAt === null || now - warnedAt > WARN_TIMEOUT_MS;

    if (armed) {
      setPopup(true);
      if (popupTimer.current) clearTimeout(popupTimer.current);
      popupTimer.current = setTimeout(() => setPopup(false), POPUP_DURATION_MS);
      try {
        localStorage.setItem(WARNED_AT_KEY, String(now));
      } catch {}

      // The dramatic delay is served exactly once (until the cache is cleared).
      // Every later warning — including the 30-min re-arm — switches instantly.
      if (!delayDone) {
        try {
          localStorage.setItem(DELAY_DONE_KEY, "1");
        } catch {}
        if (switchTimer.current) clearTimeout(switchTimer.current);
        switchTimer.current = setTimeout(() => {
          switchTimer.current = null;
          applyTheme(true);
        }, FIRST_SWITCH_DELAY_MS);
        return;
      }

      applyTheme(true);
      return;
    }

    // Warning still fresh (< 30 min) → switch instantly, no popup.
    setPopup(false);
    if (switchTimer.current) clearTimeout(switchTimer.current);
    applyTheme(true);
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        aria-label="Toggle theme"
        title="Toggle theme"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-muted hover:text-foreground"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={flash ? "emblem" : light ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            {flash ? <JediEmblem className="h-[18px] w-[18px] text-violet-400" /> : light ? sun : moon}
          </motion.span>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {popup && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="status"
            className="theme-warning absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-violet-500/40 bg-[#15101f]/95 px-4 py-3 text-xs leading-relaxed text-violet-200 shadow-2xl backdrop-blur-md"
          >
            <p>You have no choice but to embrace the dark side…</p>
            <p className="theme-warning-sub mt-2.5 text-[11px] italic text-violet-300/70">
              (Light mode can be difficult to read — use at your discretion)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
