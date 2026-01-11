import { useState, useEffect } from "react";
import { Coordinates, Madhab } from "adhan";
import { storage } from "@/lib/storage";
import { getRecommendedMethod } from "../utils";

// Define a safe type for Madhab values
type MadhabValue = typeof Madhab.Hanafi | typeof Madhab.Shafi;

export function useSettings(coords: Coordinates) {
  // 1. Madhab: Persisted in LocalStorage (Default: Hanafi)
  // We store the serializable value (1 for Hanafi, 2 for Standard) or string "Hanafi"
  const [madhab, setMadhab] = useState<MadhabValue>(Madhab.Hanafi);

  // 2. Method: Transient (Not saved), defaults to Smart Logic
  const [method, setMethod] = useState<string>("MoonsightingCommittee");

  // Load Madhab from storage on mount
  useEffect(() => {
    const saved = storage.getItem<string>("madhab", "Hanafi");
    setMadhab(saved === "Hanafi" ? Madhab.Hanafi : Madhab.Shafi);
  }, []);

  // Recalculate Method when coords change (Smart Country Logic)
  useEffect(() => {
    // 1. Check if user has a saved preference
    const savedMethod = storage.getItem<string | null>("calculationMethod", null);

    if (savedMethod) {
      setMethod(savedMethod); // Use saved preference
    } else if (coords) {
      // 2. If no save, use auto-detect
      const smartMethod = getRecommendedMethod(coords);
      setMethod(smartMethod);
    }
  }, [coords]);

  // Actions
  const toggleMadhab = (val: "Hanafi" | "Standard") => {
    const newVal = val === "Hanafi" ? Madhab.Hanafi : Madhab.Shafi;
    setMadhab(newVal);
    storage.setItem("madhab", val);
  };

  // Wrapper to save preference when user changes dropdown
  const handleMethodChange = (val: string) => {
    setMethod(val);
    storage.setItem("calculationMethod", val);
  };

  return {
    madhab,
    method,
    setMethod: handleMethodChange,
    toggleMadhab,
  };
}
