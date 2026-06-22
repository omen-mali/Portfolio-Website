"use client";

import { useSyncExternalStore } from "react";

// Cross-section deep-link highlight. A quick-link in one section (e.g. the
// "What I do" cards) scrolls to a target elsewhere (a project card or an
// experience bullet) and flashes a highlight on it for HIGHLIGHT_MS.
//
// Tiny external store (same pattern as logoPhase) so any component can read the
// active target via useSyncExternalStore without a context provider.

// How long the highlight is held at full strength before it begins to fade.
export const HIGHLIGHT_MS = 5000;
// Fade-out duration (matches the CSS opacity transition on the targets).
export const HIGHLIGHT_FADE_MS = 600;

export type HighlightKind = "project" | "experience";
// "in"  → held at full strength; "out" → fading away (consumers ease to 0).
export type HighlightPhase = "in" | "out";
export interface HighlightTarget {
  kind: HighlightKind;
  id: string;
  phase: HighlightPhase;
}

let current: HighlightTarget | null = null;
const listeners = new Set<() => void>();
let clearTimer: ReturnType<typeof setTimeout> | null = null;
let fadeTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getSnapshot = () => current;
const getServerSnapshot = (): HighlightTarget | null => null;

/** Subscribe to the active highlight target (null when nothing is highlighted). */
export function useHighlight(): HighlightTarget | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Scroll a target element into view (centered) and flash its highlight for
 * HIGHLIGHT_MS. `compareId` is what consumers match against; `scrollId`
 * defaults to it but can differ (e.g. a project compares by slug but scrolls
 * to `project-<slug>`).
 */
export function jumpAndHighlight(
  kind: HighlightKind,
  compareId: string,
  scrollId: string = compareId,
) {
  if (typeof document !== "undefined") {
    document.getElementById(scrollId)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
  if (clearTimer) clearTimeout(clearTimer);
  if (fadeTimer) clearTimeout(fadeTimer);

  current = { kind, id: compareId, phase: "in" };
  emit();

  // Hold at full strength, then flip to the fading phase, then clear.
  clearTimer = setTimeout(() => {
    clearTimer = null;
    if (current) {
      current = { ...current, phase: "out" };
      emit();
    }
    fadeTimer = setTimeout(() => {
      fadeTimer = null;
      current = null;
      emit();
    }, HIGHLIGHT_FADE_MS);
  }, HIGHLIGHT_MS);
}
