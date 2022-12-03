import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import mongoose from 'mongoose';
import { jwtChecker } from './middlewares/jwt-checker';
import { createPaymentRouter } from './routes/create-payment';

const app = express();
app.use(json());

app.use(jwtChecker);

app.use(createPaymentRouter);

app.all('*', () => {
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
        console.log('Payments listening on 4002');
    });
}

start();