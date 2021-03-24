import { Router } from 'express';

import UserExperienceController
  from '@modules/users/infra/http/controllers/UserExperienceController';
import useExperienceTokenMiddleware
  from '@modules/experience_tokens/infra/http/middlewares/useExperienceToken';
import ensureAuthenticatedMiddleware from '../middlewares/ensureAuthenticated';

const userExperienceController = new UserExperienceController();
const experienceRouter = Router();

experienceRouter.put(
  '/',
  ensureAuthenticatedMiddleware,
  useExperienceTokenMiddleware,
  userExperienceController.update,
);

export default experienceRouter;
