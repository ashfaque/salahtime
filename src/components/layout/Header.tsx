"use client"; // REQUIRED: Because we use interactivity

import { CalendarIcon } from "@/components/ui/Icon";
import { getTimezoneShort, formatInputDate } from "@/lib/date-utils";
import { useRef } from "react";
import { useTheme } from "@/modules/prayer/hooks/useTheme";

interface HeaderProps {
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
}

export function Header({ currentDate, onDateChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Function to open the hidden date picker
  const handleCalendarClick = () => {
    dateInputRef.current?.showPicker(); // 'showPicker' is the modern native API
  };

  // Handle when user selects a date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && onDateChange) {
      onDateChange(new Date(e.target.value));
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-foreground/10 h-16 transition-colors">
      {/* 1. App Logo */}
      <div
        className="font-bold text-xl tracking-tighter cursor-pointer"
        onClick={() => onDateChange && onDateChange(new Date())} // Click logo to reset to Today
      >
        Salah<span className="opacity-50">Time</span>
      </div>

      {/* 2. Center Controls */}
      <div className="flex items-center gap-4 text-sm font-mono">
        {/* The Calendar Button */}
        <div className="relative">
          <button onClick={handleCalendarClick} className="p-2 hover:bg-foreground/5 rounded-full transition-colors active:scale-95" aria-label="Open Calendar">
            <CalendarIcon className="w-5 h-5" />
          </button>

          {/* HIDDEN INPUT: This is the invisible trigger */}
          <input
            ref={dateInputRef}
            type="date"
            className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
            value={currentDate ? formatInputDate(currentDate) : ""}
            onChange={handleDateChange}
          />
        </div>

        {/* Dynamic Timezone Badge */}
        <div className="px-3 py-1 border border-foreground/20 rounded-full text-xs font-bold tracking-wide text-foreground/70 cursor-help" title="Your detected timezone">
          {getTimezoneShort()}
        </div>
      </div>

      {/* 3. Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        className={`w-12 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 ${
          theme === "dark" ? "bg-foreground/20" : "bg-foreground/10"
        }`}
        aria-label="Toggle Dark Mode"
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-foreground rounded-full shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center ${
            theme === "dark" ? "left-7" : "left-1"
          }`}
        >
          {/* Optional: Tiny icons inside the circle */}
          {theme === "dark" ? <span className="text-[8px]">🌙</span> : <span className="text-[8px]">☀️</span>}
        </div>
      </button>
    </header>
  );
}
