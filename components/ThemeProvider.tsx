"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";

type ThemeMode = "day" | "night";
type ThemeContextValue = {
  mode: ThemeMode;
  controlsMode: ThemeMode;
  changeMode: (event: MouseEvent<HTMLButtonElement>, next: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("day");
  const [controlsMode, setControlsMode] = useState<ThemeMode>("day");
  const [backgroundReveal, setBackgroundReveal] = useState<{ key: number; finished: boolean } | null>(null);
  const textModeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let savedMode: string | null = null;
    try {
      savedMode = window.localStorage.getItem("site-mode");
    } catch {
      // The mode still works when browser storage is unavailable.
    }
    const initialMode = savedMode === "night" ? "night" : "day";
    document.body.dataset.siteMode = initialMode;
    document.body.dataset.textMode = initialMode;
    setMode(initialMode);
    setControlsMode(initialMode);
    return () => {
      if (textModeTimer.current) clearTimeout(textModeTimer.current);
    };
  }, []);

  function changeMode(event: MouseEvent<HTMLButtonElement>, next: ThemeMode) {
    if (next === mode || (backgroundReveal && !backgroundReveal.finished)) return;

    const body = document.body;
    try {
      window.localStorage.setItem("site-mode", next);
    } catch {
      // Keep the current page interactive even without browser storage.
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      body.dataset.siteMode = next;
      body.dataset.textMode = next;
      setBackgroundReveal(null);
      setMode(next);
      setControlsMode(next);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.ceil(Math.max(
      Math.hypot(x, y),
      Math.hypot(window.innerWidth - x, y),
      Math.hypot(x, window.innerHeight - y),
      Math.hypot(window.innerWidth - x, window.innerHeight - y)
    )) + 2;

    document.documentElement.style.setProperty("--theme-origin-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-origin-y", `${y}px`);
    document.documentElement.style.setProperty("--theme-reveal-radius", `${radius}px`);
    document.documentElement.style.setProperty("--theme-old-background", getComputedStyle(body).backgroundColor);
    body.dataset.themeRevealActive = "true";
    body.dataset.siteMode = next;
    if (textModeTimer.current) clearTimeout(textModeTimer.current);
    textModeTimer.current = setTimeout(() => {
      body.dataset.textMode = next;
      setControlsMode(next);
      textModeTimer.current = null;
    }, 420);
    setBackgroundReveal({ key: Date.now(), finished: false });
    setMode(next);
  }

  function finishBackgroundReveal() {
    const body = document.body;
    body.style.transition = "none";
    body.style.backgroundColor = "var(--project-page-background)";
    body.removeAttribute("data-theme-reveal-active");
    setBackgroundReveal((current) => current ? { ...current, finished: true } : current);
    requestAnimationFrame(() => {
      body.style.removeProperty("background-color");
      body.style.removeProperty("transition");
    });
  }

  return (
    <ThemeContext.Provider value={{ mode, controlsMode, changeMode }}>
      {children}
      {backgroundReveal ? <span key={backgroundReveal.key} className="theme-background-reveal" aria-hidden="true" onAnimationEnd={finishBackgroundReveal} /> : null}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
