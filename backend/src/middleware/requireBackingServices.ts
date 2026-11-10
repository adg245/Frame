import { Request, Response, NextFunction } from 'express';
import { isSupabaseConfigured } from '../config/supabase';
import { isDatabaseConfigured } from '../config/prisma';

/**
 * Guards any route that needs both Supabase auth and the database —
 * i.e. everything that reads or writes user-owned data. Returns a clear,
 * specific 503 naming exactly which service is missing, rather than a
 * confusing failure deeper in the stack.
 */
export function requireBackingServices(_req: Request, res: Response, next: NextFunction): void {
  if (!isSupabaseConfigured()) {
    res.status(503).json({
      error: 'Authentication is not configured on this server',
      code: 'AUTH_NOT_CONFIGURED',
      hint: 'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env',
    });
    return;
  }
  if (!isDatabaseConfigured()) {
    res.status(503).json({
      error: 'Database is not configured on this server',
      code: 'DATABASE_NOT_CONFIGURED',
      hint: 'Set DATABASE_URL in backend/.env and run `npm run db:migrate`',
    });
    return;
  }
  next();
}
