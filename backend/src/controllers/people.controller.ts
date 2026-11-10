import { Request, Response, NextFunction } from 'express';
import { tmdbService } from '../services/tmdb.service';
import { personIdParamSchema } from '../validators/movies.validator';

export const peopleController = {
  async details(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = personIdParamSchema.parse(req.params);
      const data = await tmdbService.getPersonDetails(id);
      res.json(data);
    } catch (err) { next(err); }
  },

  async movieCredits(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = personIdParamSchema.parse(req.params);
      const data = await tmdbService.getPersonMovieCredits(id);
      res.json(data);
    } catch (err) { next(err); }
  },
};
