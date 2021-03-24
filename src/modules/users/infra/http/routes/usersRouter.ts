import { Router } from 'express';

import UsersController
  from '@modules/users/infra/http/controllers/UsersController';
import experienceRouter from './experienceRouter';

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.post('/', usersController.create);
usersRouter.use('/experience/', experienceRouter);

export default usersRouter;
