"use client";

import { useRef, useEffect } from "react";

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function Typewriter({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  className = "",
}: TypewriterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef({ text: "", phraseIndex: 0, isDeleting: false });

  useEffect(() => {
    // Reduced motion: show the first phrase statically — no type/delete loop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (spanRef.current) spanRef.current.textContent = phrases[0] ?? "";
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      const s = stateRef.current;
      const current = phrases[s.phraseIndex];

      if (!s.isDeleting) {
        s.text = current.slice(0, s.text.length + 1);
        if (spanRef.current) spanRef.current.textContent = s.text;

        if (s.text.length === current.length) {
          timeoutId = setTimeout(() => {
            s.isDeleting = true;
            tick();
          }, pauseDuration);
          return;
        }
      } else {
        s.text = current.slice(0, s.text.length - 1);
        if (spanRef.current) spanRef.current.textContent = s.text;

        if (s.text.length === 0) {
          s.isDeleting = false;
          s.phraseIndex = (s.phraseIndex + 1) % phrases.length;
        }
      }

      timeoutId = setTimeout(tick, s.isDeleting ? deletingSpeed : typingSpeed);
    }

    tick();
    return () => clearTimeout(timeoutId);
  }, [phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {/* Static copy for assistive tech; the animated span re-announces
          every keystroke otherwise. */}
      <span className="sr-only">{phrases.join(". ")}</span>
      <span aria-hidden="true">
        <span ref={spanRef} />
        <span className="animate-pulse">|</span>
      </span>
    </span>
  );
}
