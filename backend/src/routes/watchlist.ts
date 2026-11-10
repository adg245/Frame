import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireBackingServices } from '../middleware/requireBackingServices';
import { watchlistController } from '../controllers/watchlist.controller';

export const watchlistRouter = Router();

watchlistRouter.use(requireBackingServices);
watchlistRouter.use(requireAuth);

watchlistRouter.get('/',      watchlistController.list);
watchlistRouter.post('/',     watchlistController.add);
watchlistRouter.put('/:id',   watchlistController.updateStatus);
watchlistRouter.delete('/:id', watchlistController.remove);
