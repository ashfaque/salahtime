import { useState, useEffect, useRef, useCallback } from "react";
import { Coordinates } from "adhan";
import { fetchFromProviders } from "@/modules/prayer/lib/ipProviders";
import { storage } from "@/lib/storage";
import { DEFAULT_LOCATION, TIMEOUTS } from "@/lib/constants";

// Default: New Delhi (Fallback) - module-level so hooks are stable
const DEFAULT_COORDS = new Coordinates(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);

export function useGeolocation() {
  // Default coords
  const defaultCoords = DEFAULT_COORDS;

  const [coords, setCoords] = useState<Coordinates>(defaultCoords);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Track numeric accuracy (meters) when GPS is available
  const [accuracy, setAccuracy] = useState<number | null>(null);
  // Track where the data came from so we can show the right UI
  const [source, setSource] = useState<"default" | "ip" | "gps">("default");
  const latestSource = useRef<typeof source>(source);
  // Prevent double-requesting GPS on mount vs permission handler
  const gpsRequestedRef = useRef(false);

  // Save valid locations to cache
  useEffect(() => {
    // Only save if it's a "real" location (not the default New Delhi)
    if (source === "gps" || source === "ip") {
      storage.setItem("lastKnownCoords", {
        lat: coords.latitude,
        lon: coords.longitude,
        source: source, // Save source too so we know how accurate it was
      });
    }
  }, [coords, source]);

  // Load cache on mount to prevent "Default location flicker"
  useEffect(() => {
    const cached = storage.getItem<{ lat: number; lon: number; source: string } | null>("lastKnownCoords", null);

    // If we have a cache, use it IMMEDIATELY as the temporary "default"
    if (cached && cached.lat && cached.lon) {
      setCoords(new Coordinates(cached.lat, cached.lon));

      // We label it as 'ip' (approx) so the UI knows it's not live GPS yet
      // This ensures the "Green Badge" only appears when real GPS confirms it later.
      setSource("ip");
      setLoading(false); // Show the data instantly!
    }
  }, []); // Runs once on mount

  // keep a ref of current source to avoid stale closures
  useEffect(() => {
    latestSource.current = source;
  }, [source]);

  // Helper: Fetch Passive Location (IP Based)
  const fetchPassiveLocation = useCallback(async () => {
    try {
      const result = await fetchFromProviders();
      if (!result) {
        console.warn("All IP providers failed");
        setError("IP location unavailable or unreliable");
        setCoords(DEFAULT_COORDS);
        setSource("default");
      } else {
        const { coords: c, provider } = result;
        // Only update if we haven't already locked onto GPS (Tier 1)
        setCoords((prev) => {
          if (latestSource.current === "gps") return prev;
          setSource("ip");
          return new Coordinates(c.lat, c.lon);
        });
        // clear errors on success
        setError(null);
        console.debug("IP lookup succeeded via", provider);
      }
    } catch (err) {
      console.warn("Passive location failed, sticking to default.", err);
      setError("IP lookup failed");
      setCoords(DEFAULT_COORDS);
      setSource("default");
    } finally {
      if (latestSource.current !== "gps") setLoading(false);
    }
  }, []);

  // Helper: Request Active GPS (The Good Stuff)
  const requestGPS = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported by this browser");
      setLoading(false);
      return;
    }

    // Many mobile browsers require a secure context (HTTPS) for geolocation.
    if (!window.isSecureContext && location.protocol !== "file:") {
      setError("Geolocation requires a secure context (HTTPS)");
      setLoading(false);
      console.warn("Insecure context: geolocation may be blocked.");
      return;
    }

    // Try high-accuracy first. If that times out or is unavailable, retry once with lower accuracy.
    const tryHighAccuracy = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const acc = typeof position.coords.accuracy === "number" ? position.coords.accuracy : NaN;

          setCoords(new Coordinates(lat, lon));
          setAccuracy(Number.isFinite(acc) ? acc : null);
          setSource("gps");
          if (acc && acc > 1000) setError("GPS accuracy is low (approximate location)");
          else setError(null);
          setLoading(false);
        },
        (err) => {
          console.warn("High-accuracy GPS failed:", err);
          const code = (err as unknown as { code?: number })?.code;
          // If timeout or position unavailable, try a low-accuracy attempt once
          if (code === 3 || code === 2) {
            tryLowAccuracy();
            return;
          }

          // For permission denied or other errors, surface and fallback
          const msg = err && typeof err.message === "string" ? err.message : "GPS failed";
          setError(msg);
          setLoading(false);
          if (latestSource.current !== "gps") {
            setLoading(true);
            fetchPassiveLocation();
          }
        },
        { enableHighAccuracy: true, timeout: TIMEOUTS.gpsHigh, maximumAge: 0 }
      );
    };

    const tryLowAccuracy = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const acc = typeof position.coords.accuracy === "number" ? position.coords.accuracy : NaN;

          setCoords(new Coordinates(lat, lon));
          setAccuracy(Number.isFinite(acc) ? acc : null);
          setSource("gps");
          // low-accuracy attempt; show warning if still poor
          if (acc && acc > 2000) setError("GPS accuracy is low (approximate location)");
          else setError(null);
          setLoading(false);
        },
        (err) => {
          console.warn("Low-accuracy GPS failed:", err);
          const msg = err && typeof err.message === "string" ? err.message : "GPS failed";
          setError(msg);
          setLoading(false);
          if (latestSource.current !== "gps") {
            setLoading(true);
            fetchPassiveLocation();
          }
        },
        { enableHighAccuracy: false, timeout: TIMEOUTS.gpsLow, maximumAge: 0 }
      );
    };

    tryHighAccuracy();
  }, [fetchPassiveLocation]);

  // useEffect(() => {
  //   // 1. Try Passive First (Fast, Silent)
  //   fetchPassiveLocation();

  //   // 2. Try Active Second (Accurate, Permission Prompt)
  //   requestGPS();
  // }, []);

  // Intentionally running on mount only; helpers are stable enough for one-shot usage
  useEffect(() => {
    // 1. ASK FOR GPS IMMEDIATELY (The "Ask Once" Logic)
    // We do this first so the popup appears instantly on load
    gpsRequestedRef.current = true;
    requestGPS();

    // 2. Simultaneously fetch IP location (as a backup)
    // If GPS is denied/ignored, this data will silently take over
    fetchPassiveLocation();
  }, [requestGPS, fetchPassiveLocation]);

  // Monitor permission changes (when supported) so we can react automatically
  useEffect(() => {
    let mounted = true;
    let permissionStatus: PermissionStatus | null = null;

    async function setup() {
      if (typeof navigator === "undefined" || !("permissions" in navigator)) return;

      try {
        const status = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        permissionStatus = status as PermissionStatus;

        const handleChange = () => {
          if (!mounted) return;
          try {
            const s = permissionStatus?.state;
            if (s === "granted") {
              // Always fetch location if granted, regardless of history.
              // We don't care if we requested it before; we have permission NOW.
              setError(null);
              setLoading(true);
              gpsRequestedRef.current = true;
              requestGPS();
            } else if (s === "denied") {
              // If user revoked, fall back to IP
              gpsRequestedRef.current = false;
              setError("GPS permission denied");
              // Only fetch passive if we aren't already on gps
              if (latestSource.current !== "gps") {
                setLoading(true);
                fetchPassiveLocation();
              }
            } else if (s === "prompt") {
              // Allow future automatic requests when prompt resolves
              gpsRequestedRef.current = false;
              if (latestSource.current !== "gps") fetchPassiveLocation();
            }
          } catch {
            console.warn("Permission change handler error");
          }
        };

        // Listen for changes
        permissionStatus.onchange = handleChange;

        // Apply initial state handler
        handleChange();
      } catch {
        // Permissions API failed or unsupported; nothing to do
      }
    }

    setup();

    return () => {
      mounted = false;
      try {
        if (permissionStatus) permissionStatus.onchange = null;
      } catch {
        /* ignore */
      }
    };
    // We intentionally do not include helpers in deps to run once on mount
  }, [fetchPassiveLocation, requestGPS]);

  // Return the 'source' so the UI knows if we are exact or guessing
  // Helpful diagnostics for debugging on problematic devices (non-invasive)
  const diagnostics = {
    geolocationSupported: typeof window !== "undefined" && "geolocation" in navigator,
    permissionsSupported: typeof navigator !== "undefined" && "permissions" in navigator,
    isSecureContext: typeof window !== "undefined" ? window.isSecureContext || location.protocol === "file:" : false,
    online: typeof navigator !== "undefined" ? navigator.onLine : false,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };

  return { coords, error, loading, source, accuracy, requestLocation: requestGPS, diagnostics };
}
