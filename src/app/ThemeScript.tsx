"use client";

import { THEME_COLORS } from "@/lib/constants";

export function ThemeScript() {
  const code = `
    (function() {
      try {
        const localTheme = localStorage.getItem("theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        const darkColor = "${THEME_COLORS.dark}";
        const lightColor = "${THEME_COLORS.light}";

        if (localTheme === "dark" || (!localTheme && systemTheme)) {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
          // Set status bar to Dark
          document.querySelector('meta[name="theme-color"]')?.setAttribute("content", darkColor);
        } else {
          document.documentElement.classList.add("light");
          document.documentElement.classList.remove("dark");
          // Set status bar to Light
          document.querySelector('meta[name="theme-color"]')?.setAttribute("content", lightColor);
        }
      } catch {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
