"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining } from "@/lib/date-utils";

interface CountdownProps {
  targetDate: Date;
}

export function Countdown({ targetDate }: CountdownProps) {
  // Initialize with correct time immediately
  const [display, setDisplay] = useState(getTimeRemaining(targetDate, new Date()));

  useEffect(() => {
    // Defines the tick logic
    const tick = () => {
      setDisplay(getTimeRemaining(targetDate, new Date()));
    };

    // Run immediately to sync
    tick();

    // Set interval for 1 second
    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span className="tabular-nums">{display}</span>;
}
