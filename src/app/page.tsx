"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrayerHero } from "@/modules/prayer/components/PrayerHero";
import { PrayerTable } from "@/modules/prayer/components/PrayerTable";
import { usePrayerTimes } from "@/modules/prayer/hooks/usePrayerTimes";
import { useGeolocation } from "@/modules/prayer/hooks/useGeolocation";
import { useSettings } from "@/modules/prayer/hooks/useSettings";
import { SettingsModal } from "@/components/layout/SettingsModal";
import { LocationBadge } from "@/components/ui/LocationBadge";
import { Toast } from "@/components/ui/Toast";

export default function Home() {
  // Initialize `date` to null to avoid server/client hydration mismatch
  const [date, setDate] = useState<Date | null>(null);
  // Separate `now` from `date` so countdowns and "next prayer" are calculated
  // relative to the real current time while `date` is the user-selected view date.
  const [now, setNow] = useState(new Date());
  // State to control if the Settings Modal is visible
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000); // Update 'now' only every 60 seconds
    return () => clearInterval(t);
  }, []);

  // Set client-only initial date to avoid hydration mismatch with server
  useEffect(() => {
    setDate(new Date());
  }, []);

  // 1. GET LOCATION
  const { coords, source, requestLocation, loading, accuracy, error } = useGeolocation();

  // 2. PASS LOCATION TO PRAYER HOOK
  // const { prayers, nextPrayer, timeRemaining, currentPrayerId, currentPrayer } = usePrayerTimes(date || now, coords, now);

  // 2. GET SETTINGS (Pass coords so it can auto-detect method)
  // This hook manages the storage and logic for Hanafi vs Standard
  const { madhab, method, setMethod, toggleMadhab } = useSettings(coords);

  // 3. PASS LOCATION & SETTINGS TO PRAYER HOOK
  // Now passing 'madhab' and 'method' so times recalculate automatically
  const { prayers, nextPrayer, currentPrayerId, currentPrayer } = usePrayerTimes(
    date || now,
    coords,
    now,
    madhab, // <-- Dynamic Madhab
    method // <-- Dynamic Method
  );

  if (!date) return null;

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      <Header
        currentDate={date}
        onDateChange={setDate}
        locationSource={source} // Pass the status ('gps' | 'ip' | 'default')
        onRetryLocation={requestLocation} // Pass the retry function
        accuracy={accuracy}
        onOpenSettings={() => setIsSettingsOpen(true)} // Connect the button click to our state
      />

      {/* The Settings Screen */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} madhab={madhab} onMadhabChange={toggleMadhab} method={method} onMethodChange={setMethod} />

      <main className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <section id="hero-section" className="h-full w-full snap-start flex flex-col items-center justify-center p-6 relative">
          <LocationBadge coords={coords} source={source} loading={loading} accuracy={accuracy} error={error} />
          <Toast message={error} visible={!!error} />
          {/* Show a small loading text if we are still finding the user */}
          {/* {locLoading && <div className="absolute top-20 bg-background/80 px-4 py-2 rounded-full text-xs animate-pulse border border-foreground/10">Detecting location...</div>} */}

          {/* Show error if they denied permission (optional UX improvement) */}
          {/* {locError && <div className="absolute top-20 bg-red-500/10 text-red-500 px-4 py-2 rounded-full text-xs border border-red-500/20">Using default location (New Delhi)</div>} */}

          <PrayerHero key={date.getTime()} date={date} setDate={setDate} nextPrayer={nextPrayer} currentPrayer={currentPrayer} />
        </section>

        <section id="table-section" className="h-full w-full snap-start flex flex-col items-center justify-center p-6 relative">
          <PrayerTable prayers={prayers} currentPrayerId={currentPrayerId} date={date} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
