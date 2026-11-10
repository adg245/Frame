// Lightweight in-memory TTL cache.
// Sufficient for a single-instance deployment; swap for Redis if scaling horizontally.

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class TTLCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

export const tmdbCache = new TTLCache();

// Cache durations
export const CACHE_TTL = {
  LIST:    5  * 60 * 1000,  // trending/popular/top-rated/upcoming — 5 min
  DETAIL:  30 * 60 * 1000,  // individual movie/person details — 30 min
  SEARCH:  2  * 60 * 1000,  // search results — 2 min
  GENRES:  24 * 60 * 60 * 1000, // genre list barely changes — 24h
  STATIC:  60 * 60 * 1000,  // credits/videos/providers — 1h
};

export function cacheKey(...parts: (string | number | undefined)[]): string {
  return parts.filter((p) => p !== undefined).join(':');
}
