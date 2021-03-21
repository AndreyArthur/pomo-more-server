import express from 'express';

import app from './app';

const server = express();

server.use(app);

server.listen(3333);
