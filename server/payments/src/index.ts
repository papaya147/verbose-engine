import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { createQRCodeRouter } from './routes/generate-qrcode';

const app = express();
app.use(json());

app.use(createQRCodeRouter);

app.all('*', (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

app.listen(4002, () => {
    console.log('Payments lietening on 4002');
});