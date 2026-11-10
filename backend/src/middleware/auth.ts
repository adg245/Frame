import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandlers';
import { getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase';

// Extended request type carrying the verified Supabase user.
export interface AuthenticatedRequest extends Request {
  userId?: string;   // Supabase auth.users.id (UUID) — the only trusted source of identity
  userEmail?: string;
}

/**
 * Verifies the Supabase JWT from the Authorization header using the
 * service-role admin client. On success, attaches the verified user ID to
 * the request — this is the ONLY place a user ID should ever be trusted
 * from. Route handlers must never read a user ID from the request body or
 * query string.
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError(401, 'Authentication required', 'AUTH_MISSING_TOKEN'));
  }

  if (!isSupabaseConfigured()) {
    return next(new AppError(503, 'Authentication is not configured on this server', 'AUTH_NOT_CONFIGURED'));
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const { data, error } = await getSupabaseAdmin().auth.getUser(token);

    if (error || !data.user) {
      return next(new AppError(401, 'Invalid or expired session', 'AUTH_INVALID_TOKEN'));
    }

    req.userId = data.user.id;
    req.userEmail = data.user.email ?? undefined;
    next();
  } catch {
    return next(new AppError(502, 'Unable to verify authentication', 'AUTH_VERIFY_FAILED'));
  }
}

/**
 * Like requireAuth, but doesn't reject the request if no token is present —
 * useful for endpoints that behave differently for guests vs signed-in users.
 * If a token IS present, it must still be valid.
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ') || !isSupabaseConfigured()) {
    return next();
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const { data } = await getSupabaseAdmin().auth.getUser(token);
    if (data.user) {
      req.userId = data.user.id;
      req.userEmail = data.user.email ?? undefined;
    }
  } catch {
    // Invalid token on an optional-auth route — proceed as guest rather than fail
  }

  next();
}
