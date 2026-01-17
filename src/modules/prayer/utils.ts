import { Coordinates, CalculationMethod } from "adhan";
import { SOUTH_ASIA_BOUNDS } from "@/lib/constants";

// Helper to determine the best calculation method based on location
export function getRecommendedMethod(coords: Coordinates) {
  const { latitude: lat, longitude: lon } = coords;

  // Approximate Bounding Box for Indian Subcontinent (India, Pak, BD)
  // Latitude: 6°N to 37°N, Longitude: 68°E to 97°E
  // const isIndianSubcontinent = lat >= 6 && lat <= 37 && lon >= 68 && lon <= 97;
  const isIndianSubcontinent = lat >= SOUTH_ASIA_BOUNDS.minLat && lat <= SOUTH_ASIA_BOUNDS.maxLat && lon >= SOUTH_ASIA_BOUNDS.minLon && lon <= SOUTH_ASIA_BOUNDS.maxLon;

  if (isIndianSubcontinent) {
    // JamiaUloomIslamia is the standard for South Asia (University of Islamic Sciences, Banuri Town, Karachi)
    return "JamiaUloomIslamia";
  }

  // Default global fallback
  return "MoonsightingCommittee";
}

// Map string names to Adhan objects
export function getMethodObj(name: string) {
  switch (name) {
    case "JamiaUloomIslamia":
      return CalculationMethod.Karachi();
    case "MoonsightingCommittee":
      return CalculationMethod.MoonsightingCommittee();
    case "Egyptian":
      return CalculationMethod.Egyptian();
    case "UmmAlQura":
      return CalculationMethod.UmmAlQura();
    case "NorthAmerica":
      return CalculationMethod.NorthAmerica();
    case "MuslimWorldLeague":
      return CalculationMethod.MuslimWorldLeague();
    default:
      return CalculationMethod.MoonsightingCommittee();
  }
}
