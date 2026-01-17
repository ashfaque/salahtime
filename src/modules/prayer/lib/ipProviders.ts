export type IpProvider = {
  name: string;
  url: string;
  // Optional: Custom parser if the API returns weird keys (like 'latitude' vs 'lat')
  parser?: (data: unknown) => { lat: number; lon: number } | null;
};

// (Ordered by Quality)
const moduleDefaultProviders: IpProvider[] = [
  // ipapi.co (Best accuracy, ~1000/day limit)
  { name: "ipapi", url: "https://ipapi.co/json/" },

  // freeipapi.com (Fast, 60 req/min limit)
  {
    name: "freeipapi",
    url: "https://freeipapi.com/api/json",
  },
  // ipwhois.app (Good accuracy, ~10k/month limit)
  { name: "ipwhois", url: "https://ipwhois.app/json/" },
];

// Clone to avoid mutating the original config
const moduleIpProviders: IpProvider[] = moduleDefaultProviders.slice();

export function registerIpProvider(p: IpProvider) {
  moduleIpProviders.unshift(p);
}

// Robust default parser that tries every common variation
const moduleDefaultParser = (data: unknown) => {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  const getNumber = (v: unknown): number | null => {
    if (typeof v === "number") return Number.isFinite(v) ? v : null;
    if (typeof v === "string") {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  };

  // Some APIs nest location in a 'location' object, others are flat
  const loc = d["location"];
  const locRec = loc && typeof loc === "object" ? (loc as Record<string, unknown>) : null;

  // Try all common keys: 'latitude', 'lat', 'latitud'
  const latCandidates: unknown[] = [d["latitude"], d["lat"], d["latitud"], locRec?.["latitude"], locRec?.["lat"]];

  // Try all common keys: 'longitude', 'lon', 'lng', 'long'
  const lonCandidates: unknown[] = [d["longitude"], d["lon"], d["lng"], d["long"], locRec?.["longitude"], locRec?.["lng"]];

  const lat = latCandidates.map(getNumber).find((n) => n !== null) ?? null;
  const lon = lonCandidates.map(getNumber).find((n) => n !== null) ?? null;

  if (lat === null || lon === null) return null;
  // Filter out "0,0" which is often a default error response
  if (lat === 0 && lon === 0) return null;

  return { lat: Number(lat), lon: Number(lon) };
};

// 4 seconds
const fetchWithTimeout = async (input: RequestInfo, ms = 4000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(input, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
};

// 4 seconds
export async function fetchFromProviders(timeoutMs = 4000) {
  for (const prov of moduleIpProviders) {
    try {
      const res = await fetchWithTimeout(prov.url, timeoutMs);
      if (!res || !res.ok) {
        console.warn(`IP provider ${prov.name} failed: HTTP ${res?.status}`);
        continue;
      }

      let data: unknown;
      try {
        data = await res.json();
      } catch {
        console.warn(`IP provider ${prov.name} returned invalid JSON`);
        continue;
      }

      // Use custom parser if provided, otherwise use default
      const coordsParsed = prov.parser ? prov.parser(data) : moduleDefaultParser(data);

      if (!coordsParsed) {
        console.warn(`IP provider ${prov.name} returned no coordinates`, data);
        continue;
      }

      // Helpful for debugging which provider actually won
      console.log(`Location found via ${prov.name}`);
      return { coords: coordsParsed, provider: prov.name };
    } catch (err) {
      // Silent fail to next provider
      console.warn(`IP provider ${prov.name} error:`, err);
    }
  }

  return null;
}
