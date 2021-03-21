import { Router } from 'express';

import usersRouter from '@modules/users//infra/http/routes/usersRouter';

const routes = Router();

routes.use('/users', usersRouter);

export default routes;
