export const MAINTENANCE_MODE = false; // Developer Toggle: Set this to 'true' to block access to the entire app
export const THEME_COLORS = {
  light: "#ededed", // User defined light
  dark: "#0a0a0a", // User defined dark
};
export const DEFAULT_LOCATION = {
  // Used if GPS/IP fails. (Kolkata, West Bengal)
  lat: 22.5726,
  lon: 88.3639,
};
export const TIMEOUTS = {
  gpsHigh: 15000, // 15s patience for high accuracy
  gpsLow: 10000, // 10s patience for low accuracy
  ipFetch: 4000, // 4s limit for IP APIs
  loadingDelay: 500, // 500ms fake delay to prevent flicker
  toast: 5000, // 5s standard duration for toasts
};
export const CACHE_LIMITS = {
  maxLocations: 100, // Max number of cached location names/addresses
};
export const MAKRUH_BUFFER_MINUTES = 5; // Dynamic Sun Buffer after Makruh calculation
export const ZAWAL_BUFFER_MINUTES = 10; // Fixed Noon Buffer, Zawal is usually standard 10 min buffer everywhere
export const SOUTH_ASIA_BOUNDS = {
  // Smart Method Switching Bounds (Indian Subcontinent)
  minLat: 5,
  maxLat: 38,
  minLon: 60,
  maxLon: 98,
};
