import { Router, Request, Response, NextFunction } from 'express';
import { moviesController } from '../controllers/movies.controller';
import { isTMDBConfigured } from '../services/tmdb.service';

export const moviesRouter = Router();

/**
 * Guards every /api/movies route: if TMDB isn't configured, respond with a
 * clear, honest 503 rather than letting requests fail deeper in the stack.
 */
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

moviesRouter.use(requireTMDB);

// Lists
moviesRouter.get('/trending',  moviesController.trending);
moviesRouter.get('/popular',   moviesController.popular);
moviesRouter.get('/top-rated', moviesController.topRated);
moviesRouter.get('/upcoming',  moviesController.upcoming);

// Search & discover
moviesRouter.get('/search',   moviesController.search);
moviesRouter.get('/discover', moviesController.discover);
moviesRouter.get('/genres',   moviesController.genres);

// Detail & related — order matters: static paths before /:id
moviesRouter.get('/:id/recommendations', moviesController.recommendations);
moviesRouter.get('/:id/similar',         moviesController.similar);
moviesRouter.get('/:id/credits',         moviesController.credits);
moviesRouter.get('/:id/videos',          moviesController.videos);
moviesRouter.get('/:id/providers',       moviesController.providers);
moviesRouter.get('/:id',                 moviesController.details);
