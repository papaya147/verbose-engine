import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { createQRCodeRouter } from './routes/create-qr-code';
import mongoose from 'mongoose';
import { createPhoneRouter } from './routes/create-phone';
import { createPaymentRouter } from './routes/create-payment';
import { getPhoneRouter } from './routes/get-phone';

const app = express();
app.use(json());

app.use(createPhoneRouter);
app.use(createQRCodeRouter);
app.use(createPaymentRouter);
app.use(getPhoneRouter);

app.all('*', (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/coupons");
        console.log("Connected to MongoDb");
    } catch (err) {
        console.error(err);
    }

    app.listen(4002, () => {
        console.log('Payments lietening on 4002');
    });
}

start();