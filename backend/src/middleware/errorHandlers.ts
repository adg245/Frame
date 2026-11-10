import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { isDev } from '../config/env';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // Application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.code ? { code: err.code } : {}),
    });
    return;
  }

  // Generic errors
  if (err instanceof Error) {
    console.error(`[Error] ${err.message}`, isDev ? err.stack : '');
    res.status(500).json({
      error: isDev ? err.message : 'Internal server error',
    });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
