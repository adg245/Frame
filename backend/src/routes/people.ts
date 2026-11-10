import { Router, Request, Response, NextFunction } from 'express';
import { peopleController } from '../controllers/people.controller';
import { isTMDBConfigured } from '../services/tmdb.service';

export const peopleRouter = Router();

function requireTMDB(_req: Request, res: Response, next: NextFunction): void {
  if (!isTMDBConfigured()) {
    res.status(503).json({
      error: 'TMDB API is not configured on this server',
      code: 'TMDB_NOT_CONFIGURED',
      hint: 'Set TMDB_API_READ_ACCESS_TOKEN in backend/.env',
    });
    return;
  }
  next();
}

peopleRouter.use(requireTMDB);

peopleRouter.get('/:id/movies', peopleController.movieCredits);
peopleRouter.get('/:id',        peopleController.details);
