import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireBackingServices } from '../middleware/requireBackingServices';
import { collectionsController } from '../controllers/collections.controller';

export const collectionsRouter = Router();

collectionsRouter.use(requireBackingServices);
collectionsRouter.use(requireAuth);

collectionsRouter.get('/',                       collectionsController.list);
collectionsRouter.post('/',                      collectionsController.create);
collectionsRouter.get('/:id',                    collectionsController.get);
collectionsRouter.put('/:id',                    collectionsController.update);
collectionsRouter.delete('/:id',                 collectionsController.remove);
collectionsRouter.post('/:id/movies',            collectionsController.addMovie);
collectionsRouter.delete('/:id/movies/:movieId', collectionsController.removeMovie);
collectionsRouter.put('/:id/reorder',            collectionsController.reorder);
