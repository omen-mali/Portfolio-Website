"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { logoPhase } from "@/lib/logoPhase";

/**
 * Brand logo: the "MA." wordmark in the Star Wars-style "Star Jedi" face,
 * rendered as an inline SVG with an animated violet gradient (the Jedi-emblem
 * palette). Three stacked layers crossfade on a 7s cycle:
 *   0) White — "MA" filled white, dot gradient-filled.
 *   1) Hollow — entire "MA." outlined (gradient stroke).
 *   2) Filled — "MA." gradient-filled with a darkened translucent outline.
 *
 * The viewBox is derived from the measured glyph ink box of "MA." at
 * font-size 100 (x:-13 y:75 w:204.56 h:160), padded for the stroke;
 * `overflow: visible` keeps the stroke from clipping at the edges.
 */
const VB = { x: -21, y: 67, w: 220.56, h: 176 };
const CX = VB.x + VB.w / 2; // 89.28
const CY = VB.y + VB.h / 2; // 155

const PHASES = 3;
const FLIP_INTERVAL = 7000; // ms per phase
const FADE = 0.5; // crossfade duration (s)
const FILL_EDGE = "rgba(8, 6, 18, 0.5)"; // darkened translucent outline on the filled state

// Hollow phase — a thin translucent gradient trace drawn INSIDE the letters
// (clipped to the glyph so it never thickens the outer silhouette). Tune here.
const HOLLOW_TRACE_WIDTH = 5; // visible inner-trace thickness (viewBox / font-size-100 units)
const HOLLOW_TRACE_OPACITY = 0.8;

export function LogoMark({
  size = 40,
  strokeWidth = 6,
  className = "",
  phase: phaseProp,
}: {
  size?: number; // rendered SVG height in px
  strokeWidth?: number; // hollow-outline width in viewBox units (font-size-100 space)
  className?: string;
  phase?: number; // when set, locks the logo to this phase (0 white, 1 hollow, 2 filled)
}) {
  const gid = `logo-grad-${useId().replace(/:/g, "")}`;
  // Global phase lock (null = auto-cycle). Nothing sets it in production, so
  // the logo cycles normally.
  const locked = useSyncExternalStore(logoPhase.subscribe, logoPhase.get, () => null);
  const [autoPhase, setAutoPhase] = useState(0);
  // Explicit prop wins over the global lock, which wins over the auto-cycle.
  const fixed = phaseProp !== undefined ? phaseProp : locked;
  const phase = fixed ?? autoPhase; // 0 white, 1 filled, 2 hollow

  // Advance the phase on a 7s loop, unless a fixed phase is supplied/locked.
  useEffect(() => {
    if (fixed !== null && fixed !== undefined) return;
    const id = setInterval(() => setAutoPhase((p) => (p + 1) % PHASES), FLIP_INTERVAL);
    return () => clearInterval(id);
  }, [fixed]);

  const textProps = {
    x: 0,
    y: 200,
    fontFamily: "'Star Jedi', var(--font-geist-mono), monospace",
    fontSize: 100,
  } as const;
  const fade = { transition: `opacity ${FADE}s ease-in-out` };
  const fillEdgeWidth = strokeWidth + 2.5; // filled outline a touch thicker than the hollow stroke

  return (
    <svg
      role="img"
      aria-label="MA."
      height={size}
      width={size * (VB.w / VB.h)}
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      overflow="visible"
      className={className}
    >
      <defs>
        <linearGradient
          id={gid}
          gradientUnits="userSpaceOnUse"
          x1={VB.x}
          y1={VB.y}
          x2={VB.x + VB.w}
          y2={VB.y + VB.h}
        >
          {/* Jedi-emblem palette (no light #c4b5fd). */}
          <stop offset="0%" stopColor="#8b5cf6">
            <animate attributeName="stop-color" values="#8b5cf6;#6366f1;#7c3aed;#8b5cf6" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#7c3aed">
            <animate attributeName="stop-color" values="#7c3aed;#8b5cf6;#6366f1;#7c3aed" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#6366f1">
            <animate attributeName="stop-color" values="#6366f1;#7c3aed;#8b5cf6;#6366f1" dur="4s" repeatCount="indefinite" />
          </stop>
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            from={`0 ${CX} ${CY}`}
            to={`360 ${CX} ${CY}`}
            dur="10s"
            repeatCount="indefinite"
          />
        </linearGradient>
        {/* Glyph-shaped clip so the hollow trace stays inside the letters. */}
        <clipPath id={`${gid}-clip`}>
          <text {...textProps}>MA.</text>
        </clipPath>
      </defs>

      {/* Phase 0 — "MA" filled white, dot gradient-filled. */}
      <g style={{ opacity: phase === 0 ? 1 : 0, ...fade }}>
        <text 
          {...textProps}
          fill="#ffffff"
          //stroke="none"
          //stroke="#000000"
          stroke={"rgba(8, 6, 18, 0.8)"}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          MA<tspan fill={`url(#${gid})`} stroke="none">.</tspan>
        </text>
      </g>

      {/* Phase 1 — "MA." gradient-filled with a thicker darkened translucent
          outline overlapping the letters (stroke painted over the fill). */}
      <g style={{ opacity: phase === 1 ? 1 : 0, ...fade }}>
        <text
          {...textProps}
          fill={`url(#${gid})`}
          stroke={"rgba(8, 6, 18, 0.8)"}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          MA.
        </text>
      </g>

      {/* Phase 2 — hollow: a thin translucent gradient trace inside the letters.
          The group is clipped to the glyph and the stroke is doubled, so only
          its inner half shows — the trace hugs the inner edge without thickening
          the outer silhouette (matching the white phase's letter shape). */}
      <g
        clipPath={`url(#${gid}-clip)`}
        style={{ opacity: phase === 2 ? 1 : 0, ...fade }}
      >
        <text
          {...textProps}
          fill="none"
          stroke={`url(#${gid})`}
          strokeOpacity={0.85}
          strokeWidth={8}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          MA.
        </text>
      </g>
    </svg>
  );
}

/**
 * Full lockup: "MA." mark + "Momen Ali" wordmark. Used in the footer.
 */
export default function Logo({
  className = "",
  markSize = 26,
}: {
  className?: string;
  markSize?: number;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Nudge the mark up ~3px: "Momen Ali" has no descenders, so its optical
          centre sits above the line-box centre — raising the box-centred glyph
          aligns the two visually. */}
      <LogoMark size={markSize} className="-translate-y-[3px]" />
      <span className="font-mono text-sm font-bold tracking-wider text-foreground">
        Momen Ali
      </span>
    </span>
  );
}
