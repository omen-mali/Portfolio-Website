// Global lock for the brand logo's animation phase.
//   null  → auto-cycle (default, production behaviour)
//   0/1/2 → all logo instances hold that phase, in sync
//
// In production nothing calls `set`, so the value stays null and the logo
// cycles normally. Kept as a tiny external store so every <LogoMark> (navbar,
// footer) can read it via useSyncExternalStore without a context provider.
let lockedPhase: number | null = null;
const listeners = new Set<() => void>();

export const logoPhase = {
  get: (): number | null => lockedPhase,
  set: (p: number | null) => {
    lockedPhase = p;
    listeners.forEach((l) => l());
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
