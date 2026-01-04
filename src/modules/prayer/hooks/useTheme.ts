import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  // Start with a safe default (light) to avoid hydration mismatch
  const [theme, setTheme] = useState<Theme>("light");

  // 1. On Load: Determine the correct starting theme
  useEffect(() => {
    // A. Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme") as Theme;

    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // B. If no save, CHECK SYSTEM PREFERENCE
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const defaultTheme = systemIsDark ? "dark" : "light";

      setTheme(defaultTheme);
      applyTheme(defaultTheme);
    }
  }, []);

  // 2. The Logic to Apply the Class
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    // Reset classes
    root.classList.remove("light", "dark");

    // Add the correct class
    root.classList.add(newTheme);
  };

  // 3. The Toggle Function
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return { theme, toggleTheme };
}
