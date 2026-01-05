import { useState, useEffect } from "react";
import { Coordinates } from "adhan";

export function useGeolocation() {
  // Default: New Delhi (Fallback)
  const defaultCoords = new Coordinates(28.6139, 77.209);

  const [coords, setCoords] = useState<Coordinates>(defaultCoords);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Track where the data came from so we can show the right UI
  const [source, setSource] = useState<"default" | "ip" | "gps">("default");

  // Helper: Fetch Passive Location (IP Based)
  const fetchPassiveLocation = async () => {
    try {
      // Using a free API for IP Geolocation (Good for MVP)
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("IP Fetch failed");
      const data = await res.json();

      // Only update if we haven't already locked onto GPS (Tier 1)
      setCoords((prev) => {
        // If we already have GPS, ignore this inferior IP data
        if (source === "gps") return prev;

        setSource("ip"); // Mark as IP data
        return new Coordinates(data.latitude, data.longitude);
      });
    } catch (err) {
      console.warn("Passive location failed, sticking to default.", err);
    } finally {
      // If we were waiting on this, stop loading
      if (source !== "gps") setLoading(false);
    }
  };

  // Helper: Request Active GPS (The Good Stuff)
  const requestGPS = () => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success! Overwrite everything with high-accuracy data
        setCoords(new Coordinates(position.coords.latitude, position.coords.longitude));
        setSource("gps");
        setLoading(false);
        setError(null);
      },
      (err) => {
        // If denied, we don't crash. We just silently fail.
        // The user effectively stays on 'ip' or 'default'
        console.warn("GPS Denied/Failed:", err.message);
        setLoading(false);
        // We do NOT set an error message here to avoid ugly red text.
        // The UI will just see we are not on 'gps' source.
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // useEffect(() => {
  //   // 1. Try Passive First (Fast, Silent)
  //   fetchPassiveLocation();

  //   // 2. Try Active Second (Accurate, Permission Prompt)
  //   requestGPS();
  // }, []);

  // Intentionally running on mount only; helpers are stable enough for one-shot usage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // 1. ASK FOR GPS IMMEDIATELY (The "Ask Once" Logic)
    // We do this first so the popup appears instantly on load
    requestGPS();

    // 2. Simultaneously fetch IP location (as a backup)
    // If GPS is denied/ignored, this data will silently take over
    fetchPassiveLocation();
  }, []);

  // Return the 'source' so the UI knows if we are exact or guessing
  return { coords, error, loading, source, requestLocation: requestGPS };
}
