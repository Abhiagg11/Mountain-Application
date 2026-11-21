export const STORAGE_KEYS = {
  theme: "ime-theme-v1",
  spots: "ime-spots-v1",
  travellers: "ime-travellers-v1",
  expenses: "ime-expenses-v1",
  tripMeta: "ime-trip-meta-v1",
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota/privacy errors
  }
}
