import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "./ThemeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | SalahTime", // ? %s is replaced by the specific page title
    default: "SalahTime", // Used if a page doesn't define its own title
  },
  description: "A simple and elegant prayer timetable app to get daily prayer times based on your location.",
  manifest: "/manifest.json",
};

// Viewport settings are correct for mobile preventing zoom on input
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming when tapping inputs on iOS
};

// ? SYNTAX: function RootLayout(VARIABLE: TYPE_HINT) { ... }
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
