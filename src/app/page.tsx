"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrayerHero } from "@/modules/prayer/components/PrayerHero";
import { PrayerTable } from "@/modules/prayer/components/PrayerTable";
import { usePrayerTimes } from "@/modules/prayer/hooks/usePrayerTimes";
import { useGeolocation } from "@/modules/prayer/hooks/useGeolocation";

export default function Home() {
  const [date, setDate] = useState(new Date());

  // 1. GET LOCATION
  const { coords, loading: locLoading, error: locError } = useGeolocation();

  // 2. PASS LOCATION TO PRAYER HOOK
  const { prayers, nextPrayer, timeRemaining, currentPrayerId, currentPrayer } = usePrayerTimes(date, coords);

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      <Header currentDate={date} onDateChange={setDate} />

      <main className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <section id="hero-section" className="h-full w-full snap-start flex flex-col items-center justify-center p-6 relative">
          {/* Show a small loading text if we are still finding the user */}
          {locLoading && <div className="absolute top-20 bg-background/80 px-4 py-2 rounded-full text-xs animate-pulse border border-foreground/10">Detecting location...</div>}

          {/* Show error if they denied permission (optional UX improvement) */}
          {locError && <div className="absolute top-20 bg-red-500/10 text-red-500 px-4 py-2 rounded-full text-xs border border-red-500/20">Using default location (New Delhi)</div>}

          <PrayerHero key={date.getTime()} date={date} setDate={setDate} nextPrayer={nextPrayer} currentPrayer={currentPrayer} timeRemaining={timeRemaining} />
        </section>

        <section id="table-section" className="h-full w-full snap-start flex flex-col items-center justify-center p-6 relative">
          <PrayerTable prayers={prayers} currentPrayerId={currentPrayerId} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
