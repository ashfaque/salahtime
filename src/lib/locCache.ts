import { CACHE_LIMITS } from "@/lib/constants";

const CACHE_PREFIX = "loc_";
const INDEX_KEY = "loc_index";
const MAX_CACHE_ITEMS = CACHE_LIMITS.maxLocations;

type IndexEntry = { key: string; time: number };

function safeParse(s: string | null): IndexEntry[] {
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed)) return parsed as IndexEntry[];
  } catch {
    /* ignore */
  }
  return [];
}

export function makeCacheKey(lat: number, lon: number) {
  return `${CACHE_PREFIX}${lat.toFixed(3)}_${lon.toFixed(3)}`;
}

export function getCachedLocation(lat: number, lon: number): string | null {
  try {
    const key = makeCacheKey(lat, lon);
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function saveCachedLocation(lat: number, lon: number, value: string) {
  try {
    const key = makeCacheKey(lat, lon);
    // Update value first (best-effort)
    localStorage.setItem(key, value);

    // Maintain index of keys with timestamps
    const raw = localStorage.getItem(INDEX_KEY);
    const index = safeParse(raw);

    // Remove existing entry for key if present
    const existing = index.findIndex((e) => e.key === key);
    if (existing !== -1) index.splice(existing, 1);

    index.push({ key, time: Date.now() });

    // If over limit, remove oldest
    while (index.length > MAX_CACHE_ITEMS) {
      const removed = index.shift();
      try {
        if (removed) localStorage.removeItem(removed.key);
      } catch {
        /* ignore */
      }
    }

    try {
      localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    } catch {
      // If persisting index fails, silently ignore
    }
  } catch {
    // If any localStorage op fails (private mode/ quota), ignore gracefully
  }
}

export function clearLocationCache() {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    const index = safeParse(raw);
    for (const e of index) {
      try {
        localStorage.removeItem(e.key);
      } catch {
        /* ignore */
      }
    }
    try {
      localStorage.removeItem(INDEX_KEY);
    } catch {
      /* ignore */
    }
  } catch {
    /* ignore */
  }
}

const cacheAPI = { getCachedLocation, saveCachedLocation, clearLocationCache, makeCacheKey };
export default cacheAPI;
