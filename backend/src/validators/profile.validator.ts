import { z } from 'zod';

const THEME_IDS = [
  'cinema-night',
  'noir',
  'burgundy-premiere',
  'midnight-blue',
  'forest-cinema',
  'ivory-matinee',
] as const;

export const themeSchema = z.object({
  theme: z.enum(THEME_IDS, {
    errorMap: () => ({ message: `theme must be one of: ${THEME_IDS.join(', ')}` }),
  }),
});

export const updateProfileSchema = z.object({
  displayName:       z.string().trim().min(1).max(60).optional(),
  avatarUrl:         z.string().url().max(500).nullable().optional(),
  preferredLanguage: z.string().regex(/^[a-z]{2}$/, 'must be a 2-letter ISO language code').optional(),
  preferredRegion:   z.string().regex(/^[A-Z]{2}$/, 'must be a 2-letter ISO country code').optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export type ThemeId = (typeof THEME_IDS)[number];
export { THEME_IDS };
