import { useState, useEffect } from "react";
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan";
import { getTimeRemaining } from "@/lib/date-utils";

// Strongly-typed prayer item used across the hook
interface PrayerItem {
  name: string;
  time: Date;
  isSecondary?: boolean;
}

export function usePrayerTimes(date: Date, coords: Coordinates) {
  // STATE DEFINITIONS
  const [prayerData, setPrayerData] = useState<PrayerItem[] | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerItem | null>(null);
  // To store the full current prayer object (e.g., { name: "Fajr", time: ... })
  const [currentPrayer, setCurrentPrayer] = useState<PrayerItem | null>(null);
  // Initialize with specific placeholder
  const [timeRemaining, setTimeRemaining] = useState("00:00:00");
  const [currentPrayerId, setCurrentPrayerId] = useState<string>("");

  useEffect(() => {
    if (!coords) return;

    // RESET TIMER INSTANTLY when date/coords change
    setTimeRemaining("00:00:00");

    const params = CalculationMethod.MoonsightingCommittee();

    params.madhab = Madhab.Hanafi;

    // CALCULATE: Today's times
    const prayers = new PrayerTimes(coords, date, params);

    // List of prayers in order
    const list = [
      { name: "Fajr", time: prayers.fajr },
      { name: "Sunrise", time: prayers.sunrise, isSecondary: true },
      { name: "Dhuhr", time: prayers.dhuhr },
      { name: "Asr", time: prayers.asr },
      { name: "Maghrib", time: prayers.maghrib },
      { name: "Isha", time: prayers.isha },
    ];

    setPrayerData(list);

    const currId = prayers.currentPrayer();
    // This allows the UI to know which row to highlight
    setCurrentPrayerId(currId);

    // Find the full object for the current prayer (to get the display name "Isha")
    const foundCurrent = list.find((p) => p.name.toLowerCase() === currId) || null;
    setCurrentPrayer(foundCurrent);

    // 3. FIND NEXT PRAYER (Manual Robust Logic)
    const now = new Date();
    let foundNext = null;

    // A. Check today's list: Find the first prayer that is in the future
    for (const p of list) {
      if (p.time.getTime() > now.getTime()) {
        foundNext = p;
        break; // Stop at the first one found
      }
    }

    // B. If no prayer found today (passed Isha), get Tomorrow's Fajr
    if (!foundNext) {
      const tomorrow = new Date(date);
      tomorrow.setDate(date.getDate() + 1);

      const tomorrowParams = CalculationMethod.MoonsightingCommittee();
      tomorrowParams.madhab = Madhab.Hanafi; // ? HC: Asr will jump 1 hour ahead, shadow length = 2x object height, where Standard rule for others is shadow length = 1x object height.

      const tomorrowPrayers = new PrayerTimes(coords, tomorrow, params);

      foundNext = {
        name: "Fajr",
        time: tomorrowPrayers.fajr,
      };
    }

    setNextPrayer(foundNext);
  }, [date, coords]); // Re-run if Date OR Coordinates change

  // 4. COUNTDOWN TICKER
  useEffect(() => {
    if (!nextPrayer?.time) return;

    setTimeRemaining(getTimeRemaining(nextPrayer.time));

    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(nextPrayer.time));
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPrayer]);

  // Return the new currentPrayerId along with everything else
  return {
    prayers: prayerData,
    nextPrayer,
    timeRemaining,
    currentPrayerId,
    currentPrayer,
  };
}
