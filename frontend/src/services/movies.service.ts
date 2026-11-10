import { apiClient } from '@/lib/api';
import type {
  Movie,
  MovieDetail,
  MovieCredits,
  Video,
  PaginatedResponse,
  Genre,
  WatchProviderResult,
} from '@/types/movie';

interface DiscoverParams {
  page?: number;
  genre?: string;
  year?: string;
  minRating?: string;
  language?: string;
  sortBy?: string;
}

interface WatchProvidersResponse {
  results: Record<string, WatchProviderResult & { link?: string }>;
}

export const moviesService = {
  getTrending: async (page = 1): Promise<PaginatedResponse<Movie>> => {
    const { data } = await apiClient.get('/movies/trending', { params: { page } });
    return data;
  },

  getPopular: async (page = 1): Promise<PaginatedResponse<Movie>> => {
    const { data } = await apiClient.get('/movies/popular', { params: { page } });
    return data;
  },

  getTopRated: async (page = 1): Promise<PaginatedResponse<Movie>> => {
    const { data } = await apiClient.get('/movies/top-rated', { params: { page } });
    return data;
  },

  getUpcoming: async (page = 1): Promise<PaginatedResponse<Movie>> => {
    const { data } = await apiClient.get('/movies/upcoming', { params: { page } });
    return data;
  },

  search: async (query: string, page = 1): Promise<PaginatedResponse<Movie>> => {
    const { data } = await apiClient.get('/movies/search', { params: { query, page } });
    return data;
  },

  discover: async (params: DiscoverParams): Promise<PaginatedResponse<Movie>> => {
    const { data } = await apiClient.get('/movies/discover', { params });
    return data;
  },

  getGenres: async (): Promise<Genre[]> => {
    const { data } = await apiClient.get<{ genres: Genre[] }>('/movies/genres');
    return data.genres;
  },

  getDetails: async (id: number | string): Promise<MovieDetail> => {
    const { data } = await apiClient.get(`/movies/${id}`);
    return data;
  },

  getCredits: async (id: number | string): Promise<MovieCredits> => {
    const { data } = await apiClient.get(`/movies/${id}/credits`);
    return data;
  },

  getVideos: async (id: number | string): Promise<Video[]> => {
    const { data } = await apiClient.get<{ results: Video[] }>(`/movies/${id}/videos`);
    return data.results;
  },

  getRecommendations: async (id: number | string, page = 1): Promise<PaginatedResponse<Movie>> => {
    const { data } = await apiClient.get(`/movies/${id}/recommendations`, { params: { page } });
    return data;
  },

  getSimilar: async (id: number | string, page = 1): Promise<PaginatedResponse<Movie>> => {
    const { data } = await apiClient.get(`/movies/${id}/similar`, { params: { page } });
    return data;
  },

  getWatchProviders: async (id: number | string, region = 'US'): Promise<WatchProviderResult | null> => {
    const { data } = await apiClient.get<WatchProvidersResponse>(`/movies/${id}/providers`);
    return data.results?.[region] ?? null;
  },
};

// Pick the best official trailer from a list of videos
export function pickTrailer(videos: Video[]): Video | null {
  const yt = videos.filter((v) => v.site === 'YouTube');
  return (
    yt.find((v) => v.type === 'Trailer' && v.official) ??
    yt.find((v) => v.type === 'Trailer') ??
    yt.find((v) => v.type === 'Teaser') ??
    yt[0] ??
    null
  );
}
