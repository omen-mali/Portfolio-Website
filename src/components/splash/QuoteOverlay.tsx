"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getTodaysQuote,
  getRandomQuote,
  getFavouriteQuote,
  setFavouriteQuote,
} from "@/lib/quotes";

type Mode = "daily" | "random" | "favourite";

const MODE_LABEL: Record<Mode, string> = {
  daily: "Quote of the Day",
  random: "Random Quote",
  favourite: "Favourite Quote",
};

type OverlayState = { open: boolean; quote: string; mode: Mode; isFav: boolean };

// Loop animation timings (seconds)
const FADE_IN   = 0.8;
const HOLD      = 2.5;
const FADE_OUT  = 0.8;
const CYCLE     = FADE_IN + HOLD + FADE_OUT; // 4.1 s

// SSR-safe "has favourite" subscription.
// Server always reports `false` so the Favourite button is omitted from the
// server render. After hydration, `getFavSnapshot` reads localStorage and
// the button appears if a favourite exists. Also listens for cross-tab
// updates via the `storage` event.
const favListeners = new Set<() => void>();
function notifyFavChange() {
  favListeners.forEach((fn) => fn());
}
const subscribeFav = (cb: () => void) => {
  favListeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === "favouriteQuote") cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    favListeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};
const getFavSnapshot = () => !!getFavouriteQuote();
const getFavServerSnapshot = () => false;

export default function QuoteOverlay() {
  const [overlay, setOverlay] = useState<OverlayState>({
    open: false, quote: "", mode: "daily", isFav: false,
  });
  const hasFav = useSyncExternalStore(
    subscribeFav,
    getFavSnapshot,
    getFavServerSnapshot,
  );
  const [showLoopInput, setShowLoop]  = useState(false);
  const [loopInputValue, setLoopVal]  = useState("");
  const [loopActive, setLoopActive]   = useState(false);
  const [loopQuote, setLoopQuote]     = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { open, quote, mode, isFav } = overlay;

  // Auto-focus input when loop panel opens
  useEffect(() => {
    if (showLoopInput) setTimeout(() => inputRef.current?.focus(), 50);
  }, [showLoopInput]);

  function show(type: Mode) {
    let q: string;
    if (type === "daily")     q = getTodaysQuote();
    else if (type === "random") q = getRandomQuote();
    else                        q = getFavouriteQuote() || "";
    setOverlay({ open: true, quote: q, mode: type, isFav: getFavouriteQuote() === q && q !== "" });
  }

  function toggleFav() {
    if (!quote) return;
    setFavouriteQuote(quote);
    notifyFavChange();
    setOverlay((prev) => ({ ...prev, isFav: true }));
  }

  function startLoop(e: React.FormEvent) {
    e.preventDefault();
    const q = loopInputValue.trim();
    if (!q) return;
    setLoopQuote(q);
    setLoopActive(true);
    setShowLoop(false);
    setLoopVal("");
  }

  return (
    <>
      {/* ── Trigger buttons ─────────────────────────────────────────────── */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {/* Row 1: Daily + Random + Favourite */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => show("daily")}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-muted transition-colors hover:border-muted hover:bg-white/5"
            aria-label="Show quote of the day"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            Daily
          </button>
          <button
            onClick={() => show("random")}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-muted transition-colors hover:border-muted hover:bg-white/5"
            aria-label="Show a random quote"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 3h5v5"/><path d="M4 20L21 3"/>
              <path d="M21 16v5h-5"/><path d="M15 15l6 6"/>
              <path d="M4 4l5 5"/>
            </svg>
            Random
          </button>
          {hasFav && (
            <button
              onClick={() => show("favourite")}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-muted transition-colors hover:border-muted hover:bg-white/5"
              aria-label="Show your favourite quote"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              Favourite
            </button>
          )}
        </div>

        {/* Row 2: Loop button */}
        <button
          onClick={() => setShowLoop((v) => !v)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-colors ${
            showLoopInput
              ? "border-violet-500/50 text-violet-400 bg-violet-500/5"
              : "border-border text-muted hover:border-muted hover:bg-white/5"
          }`}
          aria-label="Loop a custom quote"
          aria-expanded={showLoopInput}
        >
          {/* repeat icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 2l4 4-4 4"/>
            <path d="M3 11V9a4 4 0 014-4h14"/>
            <path d="M7 22l-4-4 4-4"/>
            <path d="M21 13v2a4 4 0 01-4 4H3"/>
          </svg>
          Loop
        </button>

        {/* Loop input panel */}
        <AnimatePresence>
          {showLoopInput && (
            <motion.form
              key="loop-input"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden w-full max-w-sm"
              onSubmit={startLoop}
            >
              <div className="flex items-center gap-2 pt-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={loopInputValue}
                  onChange={(e) => setLoopVal(e.target.value)}
                  placeholder="Enter your quote…"
                  maxLength={500}
                  className="flex-1 rounded-full border border-border bg-white/5 px-4 py-2 text-xs text-foreground placeholder:text-muted/50 outline-none focus:border-violet-500/60 transition-colors"
                  aria-label="Custom loop quote"
                />
                <button
                  type="submit"
                  disabled={!loopInputValue.trim()}
                  className="flex items-center justify-center rounded-full border border-border px-3 py-2 text-muted transition-colors hover:border-violet-500/50 hover:text-violet-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Start loop"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* ── Quote overlay ──────────────────────────────────────────────────
          Perf notes:
          - No `backdrop-blur-sm`: backdrop-filter forces the browser to
            snapshot and re-blur the entire viewport every frame while the
            fade plays, which is the dominant cost on mobile GPUs. The bg
            is already fully opaque, so the blur wasn't visually doing
            anything useful.
          - Durations halved (0.4s → 0.2s) and the 0.1s inner delay
            removed, so the click-to-readable latency drops from ~500ms
            to ~200ms. The quote text is what the user is here for — it
            should appear promptly, not slide in leisurely. */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="quote-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] px-8"
            onClick={() => setOverlay((prev) => ({ ...prev, open: false }))}
            role="dialog"
            aria-modal="true"
            aria-label="Quote overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-3 font-mono text-xs tracking-widest uppercase text-muted">
                {MODE_LABEL[mode]}
              </p>
              {quote ? (
                <blockquote className="text-2xl font-light leading-relaxed text-[#23729c] md:text-3xl">
                  {quote}
                </blockquote>
              ) : (
                <p className="text-lg text-muted">
                  No favourite saved yet. View a quote and tap the heart to save it.
                </p>
              )}
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                {quote && (
                  <button
                    onClick={toggleFav}
                    className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors ${
                      isFav
                        ? "border-pink-500/50 text-pink-400"
                        : "border-border text-muted hover:border-muted hover:bg-white/5"
                    }`}
                    aria-label={isFav ? "Saved as favourite" : "Save as favourite"}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                    {isFav ? "Saved" : "Favourite"}
                  </button>
                )}
                <button
                  onClick={() => show("random")}
                  className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:border-muted hover:bg-white/5"
                >
                  Another
                </button>
                <button
                  onClick={() => setOverlay((prev) => ({ ...prev, open: false }))}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loop overlay ─────────────────────────────────────────────────── */}
      {loopActive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] cursor-pointer select-none"
          onDoubleClick={() => setLoopActive(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Looping quote — double-click to exit"
        >
          <motion.blockquote
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: CYCLE,
              times: [0, FADE_IN / CYCLE, (FADE_IN + HOLD) / CYCLE, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="max-w-2xl px-8 text-center"
          >
            <p className="text-2xl font-light leading-relaxed md:text-3xl text-[#23729c]">
              {loopQuote}
            </p>
          </motion.blockquote>

          {/* Hint — fades in once after the first cycle completes */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: CYCLE + 0.5, duration: 1 }}
            className="absolute bottom-10 font-mono text-[10px] tracking-widest uppercase text-muted pointer-events-none"
          >
            Double-click to exit
          </motion.p>
        </div>
      )}
    </>
  );
}
