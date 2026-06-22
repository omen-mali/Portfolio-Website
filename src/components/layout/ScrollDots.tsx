"use client";

import { SECTIONS, useActiveSection } from "@/lib/useActiveSection";

export default function ScrollDots() {
  const active = useActiveSection();

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() =>
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label={s.label}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-2"
          >
            {/* Label — revealed on hover, slides in to the left of the dot. */}
            <span className="pointer-events-none translate-x-1 rounded-md border border-border bg-[#0e0e10]/90 px-2 py-1 text-[11px] font-medium text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-foreground group-hover:opacity-100">
              {s.label}
            </span>
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full border transition-all duration-200 ${
                isActive
                  ? "scale-125 border-violet-400 bg-violet-500/90"
                  : "border-muted/60 bg-white/10 group-hover:border-violet-400 group-hover:bg-violet-500/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
