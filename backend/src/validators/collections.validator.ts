import { z } from 'zod';

export const createCollectionSchema = z.object({
  name:        z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().trim().max(500).optional(),
});

export const updateCollectionSchema = z.object({
  name:        z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(500).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' });

export const addMovieToCollectionSchema = z.object({
  tmdbMovieId: z.coerce.number().int().positive(),
});

export const reorderMoviesSchema = z.object({
  // Ordered array of CollectionMovie IDs representing the new order
  movieIds: z.array(z.string().min(1)).min(1),
});

export const collectionIdParamSchema = z.object({
  id: z.string().min(1),
});

export const collectionMovieParamSchema = z.object({
  id: z.string().min(1),
  movieId: z.coerce.number().int().positive(),
});
