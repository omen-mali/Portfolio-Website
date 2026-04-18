"use client";

import { useBackground } from "./BackgroundProvider";

export default function BackgroundGrid() {
  const { settings } = useBackground();

  if (!settings.grid) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}
