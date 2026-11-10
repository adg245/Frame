import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT:                        z.string().default('3001'),
  NODE_ENV:                    z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL:                z.string().default('http://localhost:5173'),
  API_KEY:                     z.string().optional(),
  DATABASE_URL:                z.string().optional(),
  DIRECT_URL:                  z.string().optional(),
  SUPABASE_URL:                z.string().optional(),
  SUPABASE_ANON_KEY:           z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY:   z.string().optional(),
  TMDB_API_READ_ACCESS_TOKEN:  z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isDev  = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
