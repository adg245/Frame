import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireBackingServices } from '../middleware/requireBackingServices';
import { profileController } from '../controllers/profile.controller';

export const profileRouter = Router();

profileRouter.use(requireBackingServices);
profileRouter.use(requireAuth);

profileRouter.get('/',      profileController.get);
profileRouter.put('/',      profileController.update);
profileRouter.put('/theme', profileController.updateTheme);
