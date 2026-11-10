import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireBackingServices } from '../middleware/requireBackingServices';
import { historyController } from '../controllers/history.controller';

export const historyRouter = Router();

historyRouter.use(requireBackingServices);
historyRouter.use(requireAuth);

historyRouter.get('/',               historyController.list);
historyRouter.post('/',              historyController.upsert);
historyRouter.get('/:tmdbMovieId',   historyController.getForMovie);
