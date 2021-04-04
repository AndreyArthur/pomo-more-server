import express from 'express';
import 'express-async-errors';

import routes from '@shared/infra/http/routes';
import globalExceptionHandlerMiddleware
  from '@shared/infra/http/middlewares/globalExceptionHandler';

const app = express();

app.use(express.json());
app.use(routes);
app.use(globalExceptionHandlerMiddleware);

export default app;
