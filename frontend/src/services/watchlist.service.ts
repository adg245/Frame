import { apiClient } from '@/lib/api';
import type { WatchlistEntry, WatchlistStatus } from '@/types/user';

export const watchlistService = {
  list: async (status?: WatchlistStatus): Promise<WatchlistEntry[]> => {
    const { data } = await apiClient.get<{ entries: WatchlistEntry[] }>('/watchlist', {
      params: status ? { status } : {},
    });
    return data.entries;
  },

  add: async (tmdbMovieId: number, status: WatchlistStatus = 'planning'): Promise<WatchlistEntry> => {
    const { data } = await apiClient.post('/watchlist', { tmdbMovieId, status });
    return data;
  },

  updateStatus: async (id: string, status: WatchlistStatus): Promise<WatchlistEntry> => {
    const { data } = await apiClient.put(`/watchlist/${id}`, { status });
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/watchlist/${id}`);
  },
};
