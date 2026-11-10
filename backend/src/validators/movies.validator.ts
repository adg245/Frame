import { z } from 'zod';

export const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(500).optional().default(1),
});

export const searchQuerySchema = z.object({
  query: z.string().trim().min(1, 'Search query cannot be empty').max(200),
  page: z.coerce.number().int().min(1).max(500).optional().default(1),
});

export const discoverQuerySchema = z.object({
  page:      z.coerce.number().int().min(1).max(500).optional().default(1),
  genre:     z.string().regex(/^\d+(,\d+)*$/, 'genre must be comma-separated TMDB genre IDs').optional(),
  year:      z.string().regex(/^\d{4}$/, 'year must be a 4-digit year').optional(),
  minRating: z.string().regex(/^(10(\.0)?|[0-9](\.\d)?)$/, 'minRating must be between 0 and 10').optional(),
  language:  z.string().regex(/^[a-z]{2}$/, 'language must be a 2-letter ISO code').optional(),
  sortBy: z
    .enum([
      'popularity.desc', 'popularity.asc',
      'vote_average.desc', 'vote_average.asc',
      'release_date.desc', 'release_date.asc',
      'revenue.desc', 'revenue.asc',
    ])
    .optional()
    .default('popularity.desc'),
});

export const movieIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Movie ID must be numeric'),
});

export const personIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Person ID must be numeric'),
});
