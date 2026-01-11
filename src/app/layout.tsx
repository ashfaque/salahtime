import { MAINTENANCE_MODE } from "@/lib/constants";
import { StatusScreen } from "@/components/ui/StatusScreen";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/app/ThemeScript";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

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
  manifest: `${basePath}/manifest.json`,
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
  // If maintenance is on, hijack the entire body content
  if (MAINTENANCE_MODE) {
    return (
      <html lang="en">
        <body className="antialiased">
          <StatusScreen
            title="Under Maintenance"
            message="We are currently upgrading the app to make it better for you. Please check back in a few minutes."
            icon={<span className="text-4xl">🛠️</span>}
          />
        </body>
      </html>
    );
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
