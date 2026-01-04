"use client";

import { useState, useEffect } from "react";
import { ArrowDownIcon, ChevronLeft, ChevronRight } from "@/components/ui/Icon";
import { formatDate, formatTime } from "@/lib/date-utils";
import { Skeleton } from "@/components/ui/Skeleton";

interface PrayerHeroProps {
  date: Date;
  setDate: (date: Date) => void;
  nextPrayer: { name: string; time: Date } | null;
  currentPrayer: { name: string; time: Date } | null;
  timeRemaining: string;
}

export function PrayerHero({ date, setDate, nextPrayer, currentPrayer, timeRemaining }: PrayerHeroProps) {
  // 1. ALWAYS start in loading state when this component is born
  const [isLoading, setIsLoading] = useState(true);

  // 2. Automatically turn off loading after 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Simple handlers (No longer need to track loading here)
  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    setDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    setDate(newDate);
  };

  const scrollToTable = () => {
    document.getElementById("table-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // 3. Show Skeleton if we are in that 500ms window OR if data is missing
  const showSkeleton = isLoading || !nextPrayer || timeRemaining === "00:00:00";

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md text-center relative animate-in fade-in zoom-in-95 duration-300">
      {/* Date Navigation */}
      <div className="flex items-center gap-4 text-lg font-medium select-none">
        <button onClick={handlePrevDay} className="p-2 hover:bg-foreground/5 rounded-full active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </button>

        <span className="min-w-[140px]">{formatDate(date)}</span>

        <button onClick={handleNextDay} className="p-2 hover:bg-foreground/5 rounded-full active:scale-95 transition-transform">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Countdown Display */}
      {!showSkeleton && nextPrayer ? (
        <div className="space-y-2">
          <p className="text-xl text-foreground/60">{currentPrayer ? `${currentPrayer.name} ends in:` : "Next Prayer in:"}</p>
          <h1 className="text-6xl font-bold tracking-tight font-mono tabular-nums">{timeRemaining}</h1>
          <p className="text-xl">
            {nextPrayer.name} at {formatTime(nextPrayer.time)}
          </p>
        </div>
      ) : (
        // SKELETON LOADER
        <div className="space-y-4 w-full flex flex-col items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-64 rounded-xl" />
          <Skeleton className="h-6 w-48" />
        </div>
      )}

      <button onClick={scrollToTable} className="absolute -bottom-24 animate-bounce p-2 hover:bg-foreground/5 rounded-full cursor-pointer" aria-label="Scroll down">
        <ArrowDownIcon className="w-6 h-6 opacity-50" />
      </button>
    </div>
  );
}
