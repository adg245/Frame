import { Response, NextFunction } from 'express';
import { collectionsService } from '../services/collections.service';
import {
  createCollectionSchema,
  updateCollectionSchema,
  addMovieToCollectionSchema,
  reorderMoviesSchema,
  collectionIdParamSchema,
  collectionMovieParamSchema,
} from '../validators/collections.validator';
import { AppError } from '../middleware/errorHandlers';
import type { AuthenticatedRequest } from '../middleware/auth';

export const collectionsController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const collections = await collectionsService.list(req.userId);
      res.json({ collections });
    } catch (err) { next(err); }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { name, description } = createCollectionSchema.parse(req.body);
      const collection = await collectionsService.create(req.userId, name, description);
      res.status(201).json(collection);
    } catch (err) { next(err); }
  },

  async get(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { id } = collectionIdParamSchema.parse(req.params);
      const collection = await collectionsService.get(req.userId, id);
      res.json(collection);
    } catch (err) { next(err); }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { id } = collectionIdParamSchema.parse(req.params);
      const input = updateCollectionSchema.parse(req.body);
      const collection = await collectionsService.update(req.userId, id, input);
      res.json(collection);
    } catch (err) { next(err); }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { id } = collectionIdParamSchema.parse(req.params);
      await collectionsService.remove(req.userId, id);
      res.status(204).send();
    } catch (err) { next(err); }
  },

  async addMovie(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { id } = collectionIdParamSchema.parse(req.params);
      const { tmdbMovieId } = addMovieToCollectionSchema.parse(req.body);
      const collection = await collectionsService.addMovie(req.userId, id, tmdbMovieId);
      res.status(201).json(collection);
    } catch (err) { next(err); }
  },

  async removeMovie(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { id, movieId } = collectionMovieParamSchema.parse(req.params);
      const collection = await collectionsService.removeMovie(req.userId, id, movieId);
      res.json(collection);
    } catch (err) { next(err); }
  },

  async reorder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Authentication required');
      const { id } = collectionIdParamSchema.parse(req.params);
      const { movieIds } = reorderMoviesSchema.parse(req.body);
      const collection = await collectionsService.reorderMovies(req.userId, id, movieIds);
      res.json(collection);
    } catch (err) { next(err); }
  },
};
