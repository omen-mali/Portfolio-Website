"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const RING_SPRING = { stiffness: 300, damping: 20, mass: 0.5 };
const DOT_SPRING = { stiffness: 500, damping: 25, mass: 0.3 };

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const shownRef = useRef(false);
  const lastOverRef = useRef(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ringX = useSpring(mouseX, RING_SPRING);
  const ringY = useSpring(mouseY, RING_SPRING);
  const dotX = useSpring(mouseX, DOT_SPRING);
  const dotY = useSpring(mouseY, DOT_SPRING);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    // Only hide the native cursor once the replacement is actually live —
    // globals.css scopes `cursor: none` to html.custom-cursor.
    document.documentElement.classList.add("custom-cursor");

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!shownRef.current) {
        shownRef.current = true;
        setVisible(true);
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastOverRef.current < 16) return; // ~60fps throttle
      lastOverRef.current = now;
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select");
      setHovering(!!interactive);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
    };
  }, [mouseX, mouseY]);

  if (!visible) return null;

  const ringSize = hovering ? 40 : 32;

  return (
    <div aria-hidden="true" className="site-cursor">
      {/* Outer glow ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-white/20 mix-blend-difference transition-[width,height,margin] duration-150"
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-white mix-blend-difference transition-opacity duration-150"
        style={{
          x: dotX,
          y: dotY,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          opacity: hovering ? 0 : 1,
        }}
      />
    </div>
  );
}
