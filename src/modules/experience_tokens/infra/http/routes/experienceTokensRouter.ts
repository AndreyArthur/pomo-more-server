import { Router } from 'express';

/* eslint-disable max-len */
import ExperienceTokensController
  from '@modules/experience_tokens/infra/http/controllers/ExperienceTokensController';
import ensureAuthenticatedMiddleware
  from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const experienceTokensController = new ExperienceTokensController();
const experienceTokensRouter = Router();

experienceTokensRouter.post(
  '/', ensureAuthenticatedMiddleware, experienceTokensController.create,
);

export default experienceTokensRouter;
