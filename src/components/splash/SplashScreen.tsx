"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTodaysQuote } from "@/lib/quotes";

const SPLASH_DURATION = 2500;
const FADE_DURATION = 0.8;

export default function SplashScreen() {
  // Lazy initializers read browser APIs once — avoids setState-in-effect
  const [visible, setVisible] = useState(() =>
    typeof window === "undefined" || !sessionStorage.getItem("splashShown")
  );
  const [quote] = useState(() =>
    typeof window !== "undefined" && !sessionStorage.getItem("splashShown")
      ? getTodaysQuote()
      : ""
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
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
