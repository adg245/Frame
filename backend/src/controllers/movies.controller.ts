import { Request, Response, NextFunction } from 'express';
import { tmdbService } from '../services/tmdb.service';
import {
  pageQuerySchema,
  searchQuerySchema,
  discoverQuerySchema,
  movieIdParamSchema,
} from '../validators/movies.validator';

export const moviesController = {
  async trending(req: Request, res: Response, next: NextFunction) {
    try {
      const { page } = pageQuerySchema.parse(req.query);
      const data = await tmdbService.getTrending(page);
      res.json(data);
    } catch (err) { next(err); }
  },

  async popular(req: Request, res: Response, next: NextFunction) {
    try {
      const { page } = pageQuerySchema.parse(req.query);
      const data = await tmdbService.getPopular(page);
      res.json(data);
    } catch (err) { next(err); }
  },

  async topRated(req: Request, res: Response, next: NextFunction) {
    try {
      const { page } = pageQuerySchema.parse(req.query);
      const data = await tmdbService.getTopRated(page);
      res.json(data);
    } catch (err) { next(err); }
  },

  async upcoming(req: Request, res: Response, next: NextFunction) {
    try {
      const { page } = pageQuerySchema.parse(req.query);
      const data = await tmdbService.getUpcoming(page);
      res.json(data);
    } catch (err) { next(err); }
  },

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, page } = searchQuerySchema.parse(req.query);
      const data = await tmdbService.searchMovies(query, page);
      res.json(data);
    } catch (err) { next(err); }
  },

  async discover(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = discoverQuerySchema.parse(req.query);
      const data = await tmdbService.discoverMovies(parsed);
      res.json(data);
    } catch (err) { next(err); }
  },

  async genres(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tmdbService.getGenres();
      res.json(data);
    } catch (err) { next(err); }
  },

  async details(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = movieIdParamSchema.parse(req.params);
      const data = await tmdbService.getMovieDetails(id);
      res.json(data);
    } catch (err) { next(err); }
  },

  async credits(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = movieIdParamSchema.parse(req.params);
      const data = await tmdbService.getMovieCredits(id);
      res.json(data);
    } catch (err) { next(err); }
  },

  async videos(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = movieIdParamSchema.parse(req.params);
      const data = await tmdbService.getMovieVideos(id);
      res.json(data);
    } catch (err) { next(err); }
  },

  async recommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = movieIdParamSchema.parse(req.params);
      const { page } = pageQuerySchema.parse(req.query);
      const data = await tmdbService.getMovieRecommendations(id, page);
      res.json(data);
    } catch (err) { next(err); }
  },

  async similar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = movieIdParamSchema.parse(req.params);
      const { page } = pageQuerySchema.parse(req.query);
      const data = await tmdbService.getSimilarMovies(id, page);
      res.json(data);
    } catch (err) { next(err); }
  },

  async providers(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = movieIdParamSchema.parse(req.params);
      const data = await tmdbService.getWatchProviders(id);
      res.json(data);
    } catch (err) { next(err); }
  },
};
