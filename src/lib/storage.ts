// A type-safe wrapper for LocalStorage operations
// Adheres to SOLID: Single Responsibility for data persistence

export const storage = {
  getItem: <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.warn(`Error reading ${key} from localStorage`, error);
      return defaultValue;
    }
  },

  setItem: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing ${key} to localStorage`, error);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },
};
