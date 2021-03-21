import { Router } from 'express';

import UserController
  from '@modules/users/infra/http/controllers/UserController';

const userController = new UserController();
const usersRouter = Router();

usersRouter.post('/', userController.create);

export default usersRouter;
