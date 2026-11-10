import { Router, Request, Response } from 'express';
import { env } from '../config/env';
import { isTMDBConfigured } from '../services/tmdb.service';
import { isSupabaseConfigured } from '../config/supabase';
import { isDatabaseConfigured } from '../config/prisma';
import { tmdbCache } from '../utils/cache';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'FRAME API',
    version: '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    integrations: {
      tmdb:     isTMDBConfigured(),
      supabase: isSupabaseConfigured(),
      database: isDatabaseConfigured(),
    },
    cache: {
      entries: tmdbCache.size,
    },
  });
});
