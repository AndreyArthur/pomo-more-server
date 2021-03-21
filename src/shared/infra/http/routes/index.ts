import { Router } from 'express';

import usersRouter from '@modules/users//infra/http/routes/usersRouter';
import sessionsRouter from '@modules/users/infra/http/routes/sessionsRouter';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
