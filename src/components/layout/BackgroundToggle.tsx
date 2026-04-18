"use client";

import { useState } from "react";
import { useBackground } from "./BackgroundProvider";

export default function BackgroundToggle() {
  const { settings, toggle } = useBackground();
  const [expanded, setExpanded] = useState(false);

  const starsDimmed = settings.hyperspace;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {expanded && (
        <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-[#111111]/90 p-3 backdrop-blur-md">
          <label className={`flex cursor-pointer items-center gap-2 text-xs ${starsDimmed ? "text-muted/40" : "text-muted"}`}>
            <input
              type="checkbox"
              checked={settings.stars}
              onChange={() => toggle("stars")}
              className="accent-blue-500"
            />
            Stars
          </label>
          <label className={`flex cursor-pointer items-center gap-2 text-xs ${starsDimmed ? "text-muted/40" : "text-muted"}`}>
            <input
              type="checkbox"
              checked={settings.shooting}
              onChange={() => toggle("shooting")}
              className="accent-blue-500"
            />
            Shooting Stars
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={settings.grid}
              onChange={() => toggle("grid")}
              className="accent-blue-500"
            />
            Grid
          </label>
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[#111111]/80 text-muted backdrop-blur-md transition-colors hover:bg-white/10 hover:text-foreground"
        aria-label={expanded ? "Close background settings" : "Background settings"}
        title="Background settings"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </button>
    </div>
  );
}
