import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandlers';
import { tmdbCache, CACHE_TTL, cacheKey } from '../utils/cache';
import type {
  TMDBMovie,
  TMDBCredits,
  TMDBVideosResponse,
  TMDBPaginatedResponse,
  TMDBPerson,
  TMDBWatchProvidersResponse,
  TMDBGenresResponse,
} from '../types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Whether TMDB is configured. Controllers check this before calling the
 * service so they can return a clear, honest 503 instead of a confusing
 * downstream failure.
 */
export function isTMDBConfigured(): boolean {
  return !!env.TMDB_API_READ_ACCESS_TOKEN;
}

let client: AxiosInstance | null = null;

function getClient(): AxiosInstance {
  if (!client) {
    client = axios.create({
      baseURL: TMDB_BASE_URL,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${env.TMDB_API_READ_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  }
  return client;
}

/**
 * Core request wrapper: handles caching, TMDB-specific error translation,
 * and consistent AppError propagation so routes never see a raw axios error.
 */
async function tmdbGet<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  cacheTtlMs?: number
): Promise<T> {
  if (!isTMDBConfigured()) {
    throw new AppError(503, 'TMDB API is not configured on this server', 'TMDB_NOT_CONFIGURED');
  }

  const key = cacheKey(path, JSON.stringify(params));
  if (cacheTtlMs) {
    const cached = tmdbCache.get<T>(key);
    if (cached) return cached;
  }

  try {
    const response = await getClient().get<T>(path, {
      params: { language: 'en-US', ...params },
    });

    if (cacheTtlMs) {
      tmdbCache.set(key, response.data, cacheTtlMs);
    }

    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError<{ status_message?: string }>;

    if (axiosErr.response) {
      const status = axiosErr.response.status;
      const message = axiosErr.response.data?.status_message ?? 'TMDB request failed';

      if (status === 404) {
        throw new AppError(404, 'Movie or resource not found', 'TMDB_NOT_FOUND');
      }
      if (status === 401) {
        throw new AppError(502, 'TMDB authentication failed — check the API token', 'TMDB_AUTH_ERROR');
      }
      if (status === 429) {
        throw new AppError(429, 'TMDB rate limit exceeded, please try again shortly', 'TMDB_RATE_LIMIT');
      }
      throw new AppError(502, `TMDB error: ${message}`, 'TMDB_UPSTREAM_ERROR');
    }

    if (axiosErr.code === 'ECONNABORTED') {
      throw new AppError(504, 'TMDB request timed out', 'TMDB_TIMEOUT');
    }

    throw new AppError(502, 'Unable to reach TMDB', 'TMDB_UNREACHABLE');
  }
}

// ─── Movie lists ──────────────────────────────────────────────────────────────

export const tmdbService = {
  getTrending: (page = 1) =>
    tmdbGet<TMDBPaginatedResponse<TMDBMovie>>('/trending/movie/week', { page }, CACHE_TTL.LIST),

  getPopular: (page = 1) =>
    tmdbGet<TMDBPaginatedResponse<TMDBMovie>>('/movie/popular', { page }, CACHE_TTL.LIST),

  getTopRated: (page = 1) =>
    tmdbGet<TMDBPaginatedResponse<TMDBMovie>>('/movie/top_rated', { page }, CACHE_TTL.LIST),

  getUpcoming: (page = 1) =>
    tmdbGet<TMDBPaginatedResponse<TMDBMovie>>('/movie/upcoming', { page }, CACHE_TTL.LIST),

  // ─── Search & discover ────────────────────────────────────────────────────

  searchMovies: (query: string, page = 1) =>
    tmdbGet<TMDBPaginatedResponse<TMDBMovie>>('/search/movie', { query, page }, CACHE_TTL.SEARCH),

  discoverMovies: (params: {
    page?: number;
    genre?: string;
    year?: string;
    minRating?: string;
    language?: string;
    sortBy?: string;
  }) =>
    tmdbGet<TMDBPaginatedResponse<TMDBMovie>>(
      '/discover/movie',
      {
        page: params.page ?? 1,
        with_genres: params.genre,
        primary_release_year: params.year,
        'vote_average.gte': params.minRating,
        with_original_language: params.language,
        sort_by: params.sortBy ?? 'popularity.desc',
      },
      CACHE_TTL.SEARCH
    ),

  // ─── Movie detail & related ───────────────────────────────────────────────

  getMovieDetails: (id: string | number) =>
    tmdbGet<TMDBMovie>(`/movie/${id}`, {}, CACHE_TTL.DETAIL),

  getMovieCredits: (id: string | number) =>
    tmdbGet<TMDBCredits>(`/movie/${id}/credits`, {}, CACHE_TTL.STATIC),

  getMovieVideos: (id: string | number) =>
    tmdbGet<TMDBVideosResponse>(`/movie/${id}/videos`, {}, CACHE_TTL.STATIC),

  getMovieRecommendations: (id: string | number, page = 1) =>
    tmdbGet<TMDBPaginatedResponse<TMDBMovie>>(`/movie/${id}/recommendations`, { page }, CACHE_TTL.STATIC),

  getSimilarMovies: (id: string | number, page = 1) =>
    tmdbGet<TMDBPaginatedResponse<TMDBMovie>>(`/movie/${id}/similar`, { page }, CACHE_TTL.STATIC),

  getWatchProviders: (id: string | number) =>
    tmdbGet<TMDBWatchProvidersResponse>(`/movie/${id}/watch/providers`, {}, CACHE_TTL.STATIC),

  // ─── Genres ───────────────────────────────────────────────────────────────

  getGenres: () =>
    tmdbGet<TMDBGenresResponse>('/genre/movie/list', {}, CACHE_TTL.GENRES),

  // ─── People ───────────────────────────────────────────────────────────────

  getPersonDetails: (id: string | number) =>
    tmdbGet<TMDBPerson>(`/person/${id}`, {}, CACHE_TTL.DETAIL),

  getPersonMovieCredits: (id: string | number) =>
    tmdbGet<{ cast: TMDBMovie[]; crew: TMDBMovie[] }>(`/person/${id}/movie_credits`, {}, CACHE_TTL.STATIC),
};
