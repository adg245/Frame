import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historyService } from '@/services/history.service';
import { useAuth } from '@/contexts/AuthContext';

export const historyKeys = {
  all:    ['history'] as const,
  list:   () => [...historyKeys.all, 'list'] as const,
  detail: (tmdbMovieId: number | string) => [...historyKeys.all, 'detail', tmdbMovieId] as const,
};

/** All watch-history entries for the signed-in user (e.g. for a "Continue Watching" row). */
export function useWatchHistoryList() {
  const { user } = useAuth();
  return useQuery({
    queryKey: historyKeys.list(),
    queryFn: historyService.list,
    enabled: !!user,
  });
}

/**
 * The saved progress for one movie, used to offer/perform resume when the
 * Watch page loads. Returns `undefined` while loading, `null` if the user
 * has never watched any of this movie, or the entry otherwise.
 */
export function useMovieWatchHistory(tmdbMovieId: number | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: historyKeys.detail(tmdbMovieId ?? ''),
    queryFn: () => historyService.getForMovie(tmdbMovieId!),
    enabled: !!user && !!tmdbMovieId,
    staleTime: 0, // always check fresh — resume position matters
  });
}

/**
 * Persists playback progress. Safe to call frequently — it's a single
 * upsert on the backend — but the player still throttles calls on its end
 * to avoid hammering the network during normal playback.
 */
export function useUpdateWatchHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: historyService.upsert,
    onSuccess: (entry) => {
      queryClient.setQueryData(historyKeys.detail(entry.tmdbMovieId), entry);
      queryClient.invalidateQueries({ queryKey: historyKeys.list() });
    },
    // Deliberately silent on error — a failed progress save shouldn't
    // interrupt playback with a toast. The next throttled call will retry.
  });
}
