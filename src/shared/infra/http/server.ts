import express from 'express';
import cors from 'cors';

import app from '@shared/infra/http/app';

const server = express();

server.use(cors());
server.use(app);

server.listen(3333);
