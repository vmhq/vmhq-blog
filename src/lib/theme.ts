export type Theme = "light" | "dark" | "system";

export function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // Ignore localStorage errors (e.g. private mode, disabled storage)
  }
  return "system";
}

export function getResolvedTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

export function applyTheme(theme: Theme) {
  const resolved = getResolvedTheme(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Ignore localStorage errors
  }
}
