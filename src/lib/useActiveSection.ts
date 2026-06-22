"use client";

import { useEffect, useState } from "react";

// Canonical home-page section order — mirrors app/page.tsx. Shared by the
// side dots and the navbar so both wayfinding systems agree.
export const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "terminal", label: "Terminal" },
  { id: "about", label: "About" },
  { id: "showcase", label: "At a Glance" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "community", label: "Community" },
  { id: "interests", label: "Interests" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Scroll-spy: returns the id of the last section whose top has crossed a line
 * ~35% down the viewport. Deterministic and monotonic with scroll position, so
 * it can't skip/flip-flop the way an IntersectionObserver "most-visible" race
 * could. rAF-throttled.
 */
export function useActiveSection(): string {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top - line <= 0) current = el.id;
      }
      // A short final section may never reach the line — snap to it at page end.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = els[els.length - 1].id;
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return active;
}
