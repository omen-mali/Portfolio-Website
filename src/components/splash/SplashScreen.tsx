"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTodaysQuote } from "@/lib/quotes";

const SPLASH_DURATION = 2500;
const FADE_DURATION = 0.8;

// SSR-safe read of the "splash already shown" session flag.
// `getServerSnapshot` forces the server render to treat the splash as
// already-shown so no splash markup is emitted during SSR. After hydration,
// `getSnapshot` reads the real sessionStorage value on the client and
// React re-renders with the correct state — no hydration mismatch.
const subscribeShown = () => () => {};
const getShownSnapshot = () =>
  sessionStorage.getItem("splashShown") !== null;
const getShownServerSnapshot = () => true;

export default function SplashScreen() {
  const alreadyShown = useSyncExternalStore(
    subscribeShown,
    getShownSnapshot,
    getShownServerSnapshot,
  );
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visible = !alreadyShown && !dismissed;
  // getTodaysQuote() is deterministic and cheap; it only runs on the client
  // because `visible` is false during SSR (alreadyShown=true server-side).
  const quote = visible ? getTodaysQuote() : "";

  const dismiss = useCallback(() => {
    setDismissed(true);
    sessionStorage.setItem("splashShown", "true");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    timerRef.current = setTimeout(dismiss, SPLASH_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismiss, visible]);

  // Escape/Enter dismiss the splash too (it's already click-to-dismiss).
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dismiss, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] cursor-pointer"
          onClick={dismiss}
        >
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="max-w-2xl px-8 text-center"
          >
            <p className="text-2xl font-light leading-relaxed md:text-3xl text-[#23729c]">
              {quote}
            </p>
          </motion.blockquote>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
