"use client";

import { useEffect, useState } from "react";
import type { Coordinates } from "adhan";
import { getCachedLocation, saveCachedLocation } from "@/lib/locCache";

type Props = {
  coords: Coordinates;
  source: "default" | "ip" | "gps";
  loading?: boolean;
  accuracy?: number | null;
  error?: string | null;
  onRetry?: () => void;
};

export function LocationBadge({ coords, source, loading, accuracy, error, onRetry }: Props) {
  const [name, setName] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    function resolveLatLon(c: Coordinates) {
      const u = c as unknown;
      if (typeof u === "object" && u !== null) {
        const r = u as Record<string, unknown>;
        const maybeLat = r.latitude ?? r.lat;
        const maybeLon = r.longitude ?? r.lon ?? r.lng;

        const lat = typeof maybeLat === "number" ? maybeLat : typeof maybeLat === "string" ? Number(maybeLat) : NaN;
        const lon = typeof maybeLon === "number" ? maybeLon : typeof maybeLon === "string" ? Number(maybeLon) : NaN;

        if (!Number.isNaN(lat) && !Number.isNaN(lon)) return { lat, lon };
      }
      return null;
    }

    async function fetchName() {
      const resolved = resolveLatLon(coords);
      if (!resolved) return; // Silent return if invalid
      const { lat, lon } = resolved;

      // 1. CHECK CACHE (rounded to ~111m precision)
      try {
        const cached = getCachedLocation(lat, lon);
        if (cached) {
          if (mounted) setName(cached);
          return; // Use cache and skip network
        }
      } catch {
        // localStorage may be unavailable (private mode); ignore and continue
      }

      setFetching(true);
      try {
        // Use Nominatim reverse geocoding (no API key).
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&zoom=10&addressdetails=1`;

        const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });

        // Handle aggressive rate-limiting or blocking
        if (res.status === 429 || res.status === 403) {
          console.warn("Nominatim rate limit or access denied (status)", res.status);
          if (mounted) setName(`${lat.toFixed(3)}, ${lon.toFixed(3)}`);
          return;
        }

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

        if (mounted) {
          // show result and cache it (best-effort)
          const final = display ?? `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
          setName(final);
          if (display) saveCachedLocation(lat, lon, display);
        }
      } catch (err) {
        console.warn("Reverse geocode failed", err);
        // On error, show coordinates as fallback so UI isn't empty
        if (mounted) setName(`${lat.toFixed(3)}, ${lon.toFixed(3)}`);
      } finally {
        if (mounted) setFetching(false);
      }
    }

    // Only fetch if coords exist
    if (coords) {
      const resolved = resolveLatLon(coords);
      if (resolved) fetchName();
    }

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [coords]);

  if (loading) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-40 pointer-events-none flex flex-col items-center">
      <div className="inline-flex items-center gap-2 bg-background/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-[11px] text-foreground/80 border border-foreground/10 shadow-sm pointer-events-auto w-max max-w-[85vw]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-foreground/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 5-9 10-9 10S3 17 3 12a9 9 0 1118 0z" />
        </svg>

        <span className="leading-none">{name ?? (fetching ? "Detecting location..." : "Unknown location")}</span>

        <span className="ml-2 text-[10px] text-foreground/60 flex items-center gap-2">
          <span className="uppercase">{source}</span>
          {typeof accuracy === "number" && <span className="text-[10px] text-foreground/60">{Math.round(accuracy)}m</span>}
        </span>

        {error && <div className="ml-2 text-[10px] text-red-500/80 leading-tight">{error}</div>}
      </div>

      {/* Breathing Orange Disclaimer (Only if NOT GPS) */}
      {source !== "gps" && !fetching && (
        <button onClick={onRetry} className="mt-4 text-[13px] italic text-orange-500/90 animate-pulse pointer-events-auto hover:text-orange-600 transition-colors max-w-xs leading-tight">
          Timings may vary. Tap to enable GPS for precision.
        </button>
      )}
    </div>
  );
}
