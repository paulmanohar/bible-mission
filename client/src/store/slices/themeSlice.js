import { createSlice } from "@reduxjs/toolkit";

const THEME_KEY = "bm_theme";

const themes = {
  classic: {
    label: "Classic",
    primary: "215 25% 15%",
    primaryForeground: "40 20% 97%",
    ring: "215 25% 15%",
    accent: "0 0% 94.1%",
    accentForeground: "0 0% 9%",
    secondary: "0 0% 90%",
    secondaryForeground: "0 0% 9%",
  },
  blue: {
    label: "Ocean Blue",
    primary: "217 71% 45%",
    primaryForeground: "210 40% 98%",
    ring: "217 71% 45%",
    accent: "214 32% 91%",
    accentForeground: "222 47% 11%",
    secondary: "214 32% 91%",
    secondaryForeground: "222 47% 11%",
  },
  green: {
    label: "Forest Green",
    primary: "152 55% 28%",
    primaryForeground: "138 40% 97%",
    ring: "152 55% 28%",
    accent: "143 24% 90%",
    accentForeground: "155 40% 10%",
    secondary: "143 24% 90%",
    secondaryForeground: "155 40% 10%",
  },
};

function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--primary-foreground", theme.primaryForeground);
  root.style.setProperty("--ring", theme.ring);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-foreground", theme.accentForeground);
  root.style.setProperty("--secondary", theme.secondary);
  root.style.setProperty("--secondary-foreground", theme.secondaryForeground);
}

const saved = typeof window !== "undefined" ? localStorage.getItem(THEME_KEY) : null;
const initialTheme = saved && themes[saved] ? saved : "classic";

if (typeof window !== "undefined") {
  applyTheme(initialTheme);
}

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    active: initialTheme,
    themes: Object.entries(themes).map(([key, val]) => ({ key, label: val.label })),
  },
  reducers: {
    setTheme(state, action) {
      const name = action.payload;
      if (themes[name]) {
        state.active = name;
        applyTheme(name);
        localStorage.setItem(THEME_KEY, name);
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
