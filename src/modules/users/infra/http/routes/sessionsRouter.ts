import { Router } from 'express';

import SessionsController
  from '@modules/users/infra/http/controllers/SessionsController';
import ensureAuthenticatedMiddleware from '../middlewares/ensureAuthenticated';

const sessionsController = new SessionsController();
const sessionsRouter = Router();

sessionsRouter.post('/', sessionsController.create);

sessionsRouter.put(
  '/', ensureAuthenticatedMiddleware, sessionsController.update,
);

export default sessionsRouter;
