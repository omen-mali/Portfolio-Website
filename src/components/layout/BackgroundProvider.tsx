"use client";

import { createContext, useContext, useState, useCallback } from "react";

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
  // Lazy initializer reads localStorage once on mount — avoids setState-in-effect
  const [settings, setSettings] = useState<BackgroundSettings>(() => {
    if (typeof window === "undefined") return DEFAULT;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return { ...DEFAULT, ...JSON.parse(saved) }; }
      catch {}
    }
    return DEFAULT;
  });

  const persist = useCallback((next: BackgroundSettings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  function toggle(key: BooleanSettingKey) {
    setSettings((prev) => {
      const toggled = !prev[key];
      const next = { ...prev, [key]: toggled };

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
      return next;
    });
  }

  function setSetting<K extends keyof BackgroundSettings>(key: K, value: BackgroundSettings[K]) {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      persist(next);
      return next;
    });
  }

  return (
    <BackgroundContext.Provider value={{ settings, toggle, setSetting }}>
      {children}
    </BackgroundContext.Provider>
  );
}
