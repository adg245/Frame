import { Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';
import { updateProfileSchema, themeSchema } from '../validators/profile.validator';
import { AppError } from '../middleware/errorHandlers';
import type { AuthenticatedRequest } from '../middleware/auth';

export const profileController = {
  async get(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const profile = await profileService.getOrCreate(req.userId, req.userEmail);
      res.json(profile);
    } catch (err) { next(err); }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const input = updateProfileSchema.parse(req.body);
      const profile = await profileService.update(req.userId, input);
      res.json(profile);
    } catch (err) { next(err); }
  },

  async updateTheme(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { theme } = themeSchema.parse(req.body);
      const profile = await profileService.updateTheme(req.userId, theme);
      res.json(profile);
    } catch (err) { next(err); }
  },
};
