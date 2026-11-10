import { apiClient } from '@/lib/api';
import type { MovieCollection } from '@/types/user';

interface UpdateCollectionInput {
  name?: string;
  description?: string | null;
}

export const collectionsService = {
  list: async (): Promise<MovieCollection[]> => {
    const { data } = await apiClient.get<{ collections: MovieCollection[] }>('/collections');
    return data.collections;
  },

  get: async (id: string): Promise<MovieCollection> => {
    const { data } = await apiClient.get(`/collections/${id}`);
    return data;
  },

  create: async (name: string, description?: string): Promise<MovieCollection> => {
    const { data } = await apiClient.post('/collections', { name, description });
    return data;
  },

  update: async (id: string, input: UpdateCollectionInput): Promise<MovieCollection> => {
    const { data } = await apiClient.put(`/collections/${id}`, input);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/collections/${id}`);
  },

  addMovie: async (id: string, tmdbMovieId: number): Promise<MovieCollection> => {
    const { data } = await apiClient.post(`/collections/${id}/movies`, { tmdbMovieId });
    return data;
  },

  removeMovie: async (id: string, tmdbMovieId: number): Promise<MovieCollection> => {
    const { data } = await apiClient.delete(`/collections/${id}/movies/${tmdbMovieId}`);
    return data;
  },

  reorder: async (id: string, movieIds: string[]): Promise<MovieCollection> => {
    const { data } = await apiClient.put(`/collections/${id}/reorder`, { movieIds });
    return data;
  },
};
