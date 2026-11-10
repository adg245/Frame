import { z } from 'zod';

export const upsertHistorySchema = z.object({
  tmdbMovieId:     z.coerce.number().int().positive(),
  currentPosition: z.coerce.number().min(0).max(100000), // seconds
  duration:        z.coerce.number().min(0).max(100000).optional(),
  // Deliberately no `.default(false)` here: a regular progress-save call
  // omits `completed` entirely, and that must stay `undefined` all the way
  // into the service so it leaves an existing "completed" flag untouched.
  // Defaulting it to `false` at the schema level would silently un-complete
  // a movie on the very next progress tick after it finished.
  completed:       z.boolean().optional(),
});

export const movieIdParamSchema = z.object({
  tmdbMovieId: z.string().regex(/^\d+$/, 'tmdbMovieId must be numeric'),
});
