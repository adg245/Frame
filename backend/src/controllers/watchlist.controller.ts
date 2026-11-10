import { Response, NextFunction } from 'express';
import { watchlistService } from '../services/watchlist.service';
import {
  createWatchlistEntrySchema,
  updateWatchlistEntrySchema,
  watchlistIdParamSchema,
  watchlistQuerySchema,
} from '../validators/watchlist.validator';
import { AppError } from '../middleware/errorHandlers';
import type { AuthenticatedRequest } from '../middleware/auth';

export const watchlistController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { status } = watchlistQuerySchema.parse(req.query);
      const entries = await watchlistService.list(req.userId, status);
      res.json({ entries });
    } catch (err) { next(err); }
  },

  async add(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { tmdbMovieId, status } = createWatchlistEntrySchema.parse(req.body);
      const entry = await watchlistService.add(req.userId, tmdbMovieId, status);
      res.status(201).json(entry);
    } catch (err) { next(err); }
  },

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { id } = watchlistIdParamSchema.parse(req.params);
      const { status } = updateWatchlistEntrySchema.parse(req.body);
      const entry = await watchlistService.updateStatus(req.userId, id, status);
      res.json(entry);
    } catch (err) { next(err); }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { id } = watchlistIdParamSchema.parse(req.params);
      await watchlistService.remove(req.userId, id);
      res.status(204).send();
    } catch (err) { next(err); }
  },
};
