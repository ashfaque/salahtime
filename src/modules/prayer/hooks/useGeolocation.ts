import { useState, useEffect } from "react";
import { Coordinates } from "adhan";

export function useGeolocation() {
  // Default to New Delhi only as a fallback if they deny permission
  const [coords, setCoords] = useState<Coordinates>(new Coordinates(28.6139, 77.209));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords(new Coordinates(position.coords.latitude, position.coords.longitude));
        setLoading(false);
      },
      (err) => {
        setError(err.message); // e.g. "User denied Geolocation"
        setLoading(false);
      }
    );
  }, []);

  return { coords, error, loading };
}
