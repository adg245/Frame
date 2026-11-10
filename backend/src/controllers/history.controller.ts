import { Response, NextFunction } from 'express';
import { historyService } from '../services/history.service';
import { upsertHistorySchema, movieIdParamSchema } from '../validators/history.validator';
import { AppError } from '../middleware/errorHandlers';
import type { AuthenticatedRequest } from '../middleware/auth';

export const historyController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const entries = await historyService.list(req.userId);
      res.json({ entries });
    } catch (err) { next(err); }
  },

  async getForMovie(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { tmdbMovieId } = movieIdParamSchema.parse(req.params);
      const entry = await historyService.getForMovie(req.userId, Number(tmdbMovieId));
      if (!entry) {
        res.status(404).json({ error: 'No watch history for this movie' });
        return;
      }
      res.json(entry);
    } catch (err) { next(err); }
  },

  async upsert(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const input = upsertHistorySchema.parse(req.body);
      const entry = await historyService.upsert(req.userId, input);
      res.status(200).json(entry);
    } catch (err) { next(err); }
  },
};
