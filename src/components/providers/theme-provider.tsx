"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ThemeContextValue {
  isDark: boolean;
  setDark: (value: boolean) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "aperture-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setIsDark(stored === "dark");
      return;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    window.localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const value = useMemo(
    () => ({
      isDark,
      setDark: setIsDark,
      toggle: () => setIsDark((prev) => !prev),
    }),
    [isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
