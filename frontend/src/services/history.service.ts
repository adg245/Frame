import { apiClient } from '@/lib/api';
import type { WatchHistoryEntry } from '@/types/user';

interface UpsertHistoryInput {
  tmdbMovieId: number;
  currentPosition: number;
  duration?: number;
  completed?: boolean;
}

export const historyService = {
  list: async (): Promise<WatchHistoryEntry[]> => {
    const { data } = await apiClient.get<{ entries: WatchHistoryEntry[] }>('/history');
    return data.entries;
  },

  /** Returns null (never throws) if there's no history yet for this movie. */
  getForMovie: async (tmdbMovieId: number): Promise<WatchHistoryEntry | null> => {
    try {
      const { data } = await apiClient.get(`/history/${tmdbMovieId}`);
      return data;
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      if (status === 404) return null;
      throw err;
    }
  },

  upsert: async (input: UpsertHistoryInput): Promise<WatchHistoryEntry> => {
    const { data } = await apiClient.post('/history', input);
    return data;
  },
};
