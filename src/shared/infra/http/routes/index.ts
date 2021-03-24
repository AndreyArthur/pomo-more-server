import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/usersRouter';
import sessionsRouter from '@modules/users/infra/http/routes/sessionsRouter';
import experienceTokensRouter
  from '@modules/experience_tokens/infra/http/routes/experienceTokensRouter';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/experience-tokens', experienceTokensRouter);

export default routes;
