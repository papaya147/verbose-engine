import express from 'express';
import { json } from 'body-parser';

import { createAPIKeyRouter } from './routes/create-api-key';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

app.use(createAPIKeyRouter);

app.all('*', (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

app.listen(4000, () => {
    console.log('API listening on 4000');
});