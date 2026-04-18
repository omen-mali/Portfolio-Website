"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

export interface BackgroundSettings {
  stars: boolean;
  shooting: boolean;
  grid: boolean;
  hyperspace: boolean;
  hyperspaceSpeed: number;
  hyperspaceInterval: number;
}

type BooleanSettingKey = {
  [K in keyof BackgroundSettings]: BackgroundSettings[K] extends boolean ? K : never;
}[keyof BackgroundSettings];

const DEFAULT: BackgroundSettings = {
  stars: true,
  shooting: true,
  grid: true,
  hyperspace: false,
  hyperspaceSpeed: 5,
  hyperspaceInterval: 15,
};
const STORAGE_KEY = "bgSettings";

// ── Module-scoped external store ───────────────────────────────────────────
// We use useSyncExternalStore instead of useState+useEffect so that SSR
// always renders DEFAULT (via getServerSnapshot), then React swaps in the
// real localStorage-backed value after hydration. This avoids the hydration
// mismatch that would happen if we read localStorage inside a lazy useState
// initializer.

function readStoredSettings(): BackgroundSettings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT;
}

// Snapshot must be referentially stable between reads, or React will
// re-render infinitely. We cache and only replace the reference when the
// underlying state actually changes.
let cachedSnapshot: BackgroundSettings = DEFAULT;
let cacheInitialized = false;

function settingsEqual(a: BackgroundSettings, b: BackgroundSettings): boolean {
  return (
    a.stars === b.stars &&
    a.shooting === b.shooting &&
    a.grid === b.grid &&
    a.hyperspace === b.hyperspace &&
    a.hyperspaceSpeed === b.hyperspaceSpeed &&
    a.hyperspaceInterval === b.hyperspaceInterval
  );
}

function syncSnapshotFromStorage() {
  const next = readStoredSettings();
  if (!cacheInitialized || !settingsEqual(cachedSnapshot, next)) {
    cachedSnapshot = next;
    cacheInitialized = true;
  }
}

const listeners = new Set<() => void>();
function notifyListeners() {
  listeners.forEach((fn) => fn());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      syncSnapshotFromStorage();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): BackgroundSettings {
  if (!cacheInitialized) syncSnapshotFromStorage();
  return cachedSnapshot;
}

function getServerSnapshot(): BackgroundSettings {
  return DEFAULT;
}

function persist(next: BackgroundSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  cachedSnapshot = next;
  cacheInitialized = true;
  notifyListeners();
}

const BackgroundContext = createContext<{
  settings: BackgroundSettings;
  toggle: (key: BooleanSettingKey) => void;
  setSetting: <K extends keyof BackgroundSettings>(key: K, value: BackgroundSettings[K]) => void;
}>({ settings: DEFAULT, toggle: () => {}, setSetting: () => {} });

export function useBackground() {
  return useContext(BackgroundContext);
}

export default function BackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((key: BooleanSettingKey) => {
    const current = cachedSnapshot;
    const toggled = !current[key];
    const next: BackgroundSettings = { ...current, [key]: toggled };

    // Mutual exclusion: hyperspace vs stars/shooting
    if (toggled) {
      if (key === "hyperspace") {
        next.stars = false;
        next.shooting = false;
      } else if (key === "stars" || key === "shooting") {
        next.hyperspace = false;
      }
    }

    persist(next);
  }, []);

  const setSetting = useCallback(
    <K extends keyof BackgroundSettings>(key: K, value: BackgroundSettings[K]) => {
      const next: BackgroundSettings = { ...cachedSnapshot, [key]: value };
      persist(next);
    },
    [],
  );

  return (
    <BackgroundContext.Provider value={{ settings, toggle, setSetting }}>
      {children}
    </BackgroundContext.Provider>
  );
}
