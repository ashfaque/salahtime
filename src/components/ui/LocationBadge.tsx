"use client";

import { useEffect, useState } from "react";
import type { Coordinates } from "adhan";

type Props = {
  coords: Coordinates;
  source: "default" | "ip" | "gps";
  loading?: boolean;
};

export function LocationBadge({ coords, source, loading }: Props) {
  const [name, setName] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchName() {
      setFetching(true);
      try {
        const lat = (coords as any).latitude ?? (coords as any).lat;
        const lon = (coords as any).longitude ?? (coords as any).lon ?? (coords as any).lng;

        // Use Nominatim reverse geocoding (no API key). Keep it simple for UX purposes.
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lon)}&zoom=10&addressdetails=1`;

        const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("Reverse geocode failed");
        const data = await res.json();

        let display: string | null = null;
        if (data && data.address) {
          const addr = data.address;
          const city = addr.city || addr.town || addr.village || addr.hamlet;
          const state = addr.state || addr.region;
          const country = addr.country;
          display = [city, state, country].filter(Boolean).join(", ") || data.display_name || null;
        } else if (data && data.display_name) {
          display = data.display_name;
        }

        if (mounted) setName(display);
      } catch (err) {
        console.warn("Reverse geocode failed", err);
        if (mounted) setName(null);
      } finally {
        if (mounted) setFetching(false);
      }
    }

    // Only fetch if coords exist
    if (coords && (coords as any).latitude != null && (coords as any).longitude != null) {
      fetchName();
    }

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [coords?.latitude, coords?.longitude]);

  if (loading) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-40 pointer-events-none">
      <div className="inline-flex items-center gap-2 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] text-foreground/80 border border-foreground/10 shadow-sm pointer-events-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 5-9 10-9 10S3 17 3 12a9 9 0 1118 0z" />
        </svg>

        <span className="leading-none">
          {name ?? (fetching ? "Detecting location..." : "Unknown location")}
        </span>

        <span className="ml-2 text-[10px] text-foreground/60">{source}</span>
      </div>
    </div>
  );
}
