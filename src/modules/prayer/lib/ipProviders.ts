export type IpProvider = {
  name: string;
  url: string;
  parser?: (data: unknown) => { lat: number; lon: number } | null;
};

const moduleDefaultProviders: IpProvider[] = [
  { name: "ipapi", url: "https://ipapi.co/json/" },
  //   { name: "geojs", url: "https://get.geojs.io/v1/ip/geo.json" },
  { name: "ipwhois", url: "https://ipwhois.app/json/" },
];

const moduleIpProviders: IpProvider[] = moduleDefaultProviders.slice();

export function registerIpProvider(p: IpProvider) {
  // prepend so newly registered providers get tried first
  moduleIpProviders.unshift(p);
}

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

  const loc = d["location"];
  const locRec = loc && typeof loc === "object" ? (loc as Record<string, unknown>) : null;

  const latCandidates: unknown[] = [d["latitude"], d["lat"], d["latitud"], locRec?.["latitude"], locRec?.["lat"]];
  const lonCandidates: unknown[] = [d["longitude"], d["lon"], d["lng"], d["long"], locRec?.["longitude"], locRec?.["lng"]];

  const lat = latCandidates.map(getNumber).find((n) => n !== null) ?? null;
  const lon = lonCandidates.map(getNumber).find((n) => n !== null) ?? null;

  if (lat === null || lon === null) return null;
  if (lat === 0 && lon === 0) return null;
  return { lat: Number(lat), lon: Number(lon) };
};

const fetchWithTimeout = async (input: RequestInfo, ms = 6000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(input, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
};

export async function fetchFromProviders(timeoutMs = 6000) {
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

      const coordsParsed = prov.parser ? prov.parser(data) : moduleDefaultParser(data);
      if (!coordsParsed) {
        console.warn(`IP provider ${prov.name} returned no coordinates`, data);
        continue;
      }

      return { coords: coordsParsed, provider: prov.name };
    } catch (err) {
      console.warn(`IP provider ${prov.name} error:`, err);
    }
  }

  return null;
}
