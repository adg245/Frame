import { z } from 'zod';

// API-facing status strings (lowercase, underscore) map to the Prisma enum.
export const WATCHLIST_STATUSES = ['planning', 'watching', 'watched', 'on_hold', 'dropped'] as const;
export type ApiWatchlistStatus = (typeof WATCHLIST_STATUSES)[number];

const PRISMA_TO_API: Record<string, ApiWatchlistStatus> = {
  PLANNING: 'planning',
  WATCHING: 'watching',
  WATCHED:  'watched',
  ON_HOLD:  'on_hold',
  DROPPED:  'dropped',
};

const API_TO_PRISMA: Record<ApiWatchlistStatus, string> = {
  planning: 'PLANNING',
  watching: 'WATCHING',
  watched:  'WATCHED',
  on_hold:  'ON_HOLD',
  dropped:  'DROPPED',
};

export function toApiStatus(prismaStatus: string): ApiWatchlistStatus {
  return PRISMA_TO_API[prismaStatus] ?? 'planning';
}

export function toPrismaStatus(apiStatus: ApiWatchlistStatus): string {
  return API_TO_PRISMA[apiStatus];
}

export const createWatchlistEntrySchema = z.object({
  tmdbMovieId: z.coerce.number().int().positive(),
  status: z.enum(WATCHLIST_STATUSES).optional().default('planning'),
});

export const updateWatchlistEntrySchema = z.object({
  status: z.enum(WATCHLIST_STATUSES),
});

export const watchlistIdParamSchema = z.object({
  id: z.string().min(1),
});

export const watchlistQuerySchema = z.object({
  status: z.enum(WATCHLIST_STATUSES).optional(),
});
