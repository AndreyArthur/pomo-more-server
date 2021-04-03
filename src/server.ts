import express from 'express';
import cors from 'cors';

import app from '@root/app';

const server = express();

server.use(cors());
server.use(app);

server.listen(3333);
