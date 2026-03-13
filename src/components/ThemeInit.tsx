"use client";

import { useEffect } from "react";
import { loadSettings } from "@/lib/storage";
import type { ThemeMode, AccentColor } from "@/lib/types";

export function ThemeInit() {
  useEffect(() => {
    const s = loadSettings();
    const theme = (s.theme ?? "dark") as ThemeMode;
    const accent = (s.accent ?? "emerald") as AccentColor;
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.accent = accent;
  }, []);
  return null;
}

export function applyTheme(theme: ThemeMode, accent: AccentColor) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.accent = accent;
}
