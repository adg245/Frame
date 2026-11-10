import { useState, useCallback, useEffect } from 'react';
import { notify } from '@/components/ui/Toast';
import type { Movie } from '@/types/movie';

const STORAGE_KEY = 'frame-guest-watchlist';

interface StoredEntry {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  addedAt: string;
}

function readStorage(): StoredEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(entries: StoredEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage unavailable — fail silently, UI still works for the session
  }
}

/**
 * Guest-mode watchlist backed by localStorage.
 * Phase 5 will replace this with a Supabase-backed hook behind the same
 * interface once authentication (Phase 4) is wired up, so components that
 * consume this hook won't need to change.
 */
export function useLocalWatchlist() {
  const [entries, setEntries] = useState<StoredEntry[]>(() => readStorage());

  useEffect(() => {
    writeStorage(entries);
  }, [entries]);

  const watchlistIds = new Set(entries.map((e) => e.id));

  const toggle = useCallback((movie: Movie) => {
    setEntries((prev) => {
      const exists = prev.some((e) => e.id === movie.id);
      if (exists) {
        notify.info(`Removed "${movie.title}" from watchlist`);
        return prev.filter((e) => e.id !== movie.id);
      }
      notify.success(`Added "${movie.title}" to watchlist`);
      return [
        ...prev,
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  const remove = useCallback((movieId: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== movieId));
  }, []);

  const isInWatchlist = useCallback((movieId: number) => watchlistIds.has(movieId), [watchlistIds]);

  return { entries, watchlistIds, toggle, remove, isInWatchlist };
}
