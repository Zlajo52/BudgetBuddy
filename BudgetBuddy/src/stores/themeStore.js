import { createSignal } from "solid-js";

const saved = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", saved);

const [theme, setTheme] = createSignal(saved);

export const themeStore = {
  get theme() { return theme(); },
  get isDark() { return theme() === "dark"; },

  toggle() {
    const next = theme() === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  },
};