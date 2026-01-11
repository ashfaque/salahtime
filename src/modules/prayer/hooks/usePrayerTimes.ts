import { useState, useEffect, useMemo } from "react";
import { Coordinates, PrayerTimes, Madhab } from "adhan"; // CalculationMethod
import { getMethodObj } from "@/modules/prayer/utils";

// Strongly-typed prayer item used across the hook
interface PrayerItem {
  name: string;
  time: Date;
  isSecondary?: boolean;
}

type MadhabType = typeof Madhab.Hanafi | typeof Madhab.Shafi;

export function usePrayerTimes(date: Date, coords: Coordinates, nowParam?: Date, madhab: MadhabType = Madhab.Hanafi, methodName: string = "MoonsightingCommittee") {
  // STATE
  const [nextPrayer, setNextPrayer] = useState<PrayerItem | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerItem | null>(null);
  const [currentPrayerId, setCurrentPrayerId] = useState<string>("");

  // 1. EXPENSIVE CALCULATION (Memoized)
  // Only re-runs if `date` or `coords` change. NOT when `now` changes.
  const calculationData = useMemo(() => {
    if (!coords) return null;

    const params = getMethodObj(methodName);
    params.madhab = madhab;
    // const params = CalculationMethod.MoonsightingCommittee();
    // params.madhab = Madhab.Hanafi;

    // A. Calculate Today's Schedule
    const prayers = new PrayerTimes(coords, date, params);

    const list: PrayerItem[] = [
      { name: "Fajr", time: prayers.fajr },
      { name: "Sunrise", time: prayers.sunrise, isSecondary: true },
      { name: "Dhuhr", time: prayers.dhuhr },
      { name: "Asr", time: prayers.asr },
      { name: "Maghrib", time: prayers.maghrib },
      { name: "Isha", time: prayers.isha },
    ];

    // B. Pre-calculate Tomorrow's Fajr (Optimization)
    const tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);
    const tomorrowPrayers = new PrayerTimes(coords, tomorrow, params);

    const nextFajr: PrayerItem = { name: "Fajr", time: tomorrowPrayers.fajr };

    return { list, nextFajr };
  }, [date, coords, madhab, methodName]);

  // 2. CHEAP CALCULATION (The "Tick")
  // Runs every second via `nowParam`, but only does fast array lookups.
  useEffect(() => {
    if (!calculationData) return;
    const { list, nextFajr } = calculationData;

    const now = nowParam ?? new Date();

    // A. Find Current Prayer
    let currId = "";
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].time.getTime() <= now.getTime()) {
        currId = list[i].name.toLowerCase();
        break;
      }
    }
    setCurrentPrayerId(currId);
    setCurrentPrayer(list.find((p) => p.name.toLowerCase() === currId) || null);

    // B. Find Next Prayer
    let foundNext = list.find((p) => p.time.getTime() > now.getTime());

    // Fallback to pre-calculated tomorrow's Fajr
    if (!foundNext) {
      foundNext = nextFajr;
    }

    setNextPrayer(foundNext);

    // C. Update Time Remaining directly here
  }, [calculationData, nowParam]); // Dependencies: The Memoized Data + The Ticking Clock

  return {
    prayers: calculationData?.list || null,
    nextPrayer,
    currentPrayerId,
    currentPrayer,
  };
}
