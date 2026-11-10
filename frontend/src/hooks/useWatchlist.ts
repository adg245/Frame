import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { watchlistService } from '@/services/watchlist.service';
import { useLocalWatchlist } from './useLocalWatchlist';
import { notify } from '@/components/ui/Toast';
import type { Movie } from '@/types/movie';
import type { WatchlistEntry, WatchlistStatus } from '@/types/user';

export const watchlistKeys = {
  all: ['watchlist'] as const,
  list: (status?: WatchlistStatus) => [...watchlistKeys.all, 'list', status ?? 'all'] as const,
};

interface GuestWatchlistEntry {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  addedAt: string;
}

interface DbWatchlistResult {
  isGuest: false;
  entries: WatchlistEntry[];
  watchlistIds: Set<number>;
  toggle: (movie: Movie) => void;
  updateStatus: (entryId: string, status: WatchlistStatus) => void;
  remove: (entryId: string) => void;
  isLoading: boolean;
}

interface GuestWatchlistResult {
  isGuest: true;
  entries: GuestWatchlistEntry[];
  watchlistIds: Set<number>;
  toggle: (movie: Movie) => void;
  remove: (movieId: number) => void;
  isLoading: boolean;
}

export type WatchlistResult = DbWatchlistResult | GuestWatchlistResult;

function useDbWatchlist(enabled: boolean): DbWatchlistResult {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: watchlistKeys.list(),
    queryFn: () => watchlistService.list(),
    enabled,
  });

  const entries = useMemo(() => data ?? [], [data]);
  const watchlistIds = useMemo(() => new Set(entries.map((e) => e.tmdbMovieId)), [entries]);

  const addMutation = useMutation({
    mutationFn: (movie: Movie) => watchlistService.add(movie.id),
    onSuccess: (_entry, movie) => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      notify.success(`Added "${movie.title}" to watchlist`);
    },
    onError: () => notify.error('Could not update watchlist'),
  });

  const removeMutation = useMutation({
    mutationFn: (entryId: string) => watchlistService.remove(entryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: watchlistKeys.all }),
    onError: () => notify.error('Could not update watchlist'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ entryId, status }: { entryId: string; status: WatchlistStatus }) =>
      watchlistService.updateStatus(entryId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      notify.success('Status updated');
    },
    onError: () => notify.error('Could not update status'),
  });

  const toggle = (movie: Movie) => {
    const existing = entries.find((e) => e.tmdbMovieId === movie.id);
    if (existing) {
      removeMutation.mutate(existing.id);
      notify.info(`Removed "${movie.title}" from watchlist`);
    } else {
      addMutation.mutate(movie);
    }
  };

  return {
    isGuest: false,
    entries,
    watchlistIds,
    toggle,
    updateStatus: (entryId, status) => updateStatusMutation.mutate({ entryId, status }),
    remove: (entryId) => removeMutation.mutate(entryId),
    isLoading,
  };
}

/**
 * The single hook every page should use for watchlist state. Behind the
 * scenes it's DB-backed (Supabase via the backend) once signed in, and
 * falls back to the Phase 3 localStorage implementation for guests.
 *
 * The two modes have genuinely different shapes — a DB entry has its own
 * id and a status; a guest entry doesn't — so the result is a discriminated
 * union on `isGuest`. Callers that only need `watchlistIds`/`toggle` (every
 * page except Watchlist itself) can ignore the distinction entirely; the
 * Watchlist page narrows on `isGuest` before touching entry-specific fields.
 */
export function useWatchlist(): WatchlistResult {
  const { user } = useAuth();
  const db = useDbWatchlist(!!user);
  const local = useLocalWatchlist();

  if (user) return db;

  return {
    isGuest: true,
    entries: local.entries,
    watchlistIds: local.watchlistIds,
    toggle: local.toggle,
    remove: local.remove,
    isLoading: false,
  };
}
