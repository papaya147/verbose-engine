import express from 'express';
import 'express-async-errors';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.all('*', (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

app.listen(4001, () => {
    console.log('Auth listening on 4001');
});