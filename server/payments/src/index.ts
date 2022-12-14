import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import mongoose from 'mongoose';
import { jwtChecker } from './middlewares/jwt-checker';
import { createPaymentRouter } from './routes/create-payment';
import { deletePaymentsRouter } from './routes/delete-payments';
import { getPhoneRouter } from './routes/get-phone';
import { getPaymentsRouter } from './routes/get-payments';
import { getOfferByPhNo } from './routes/get-offer-phno';
import { useOfferRouter } from './routes/use-offer';

const app = express();
app.use(json());
app.use(jwtChecker);

app.use(createPaymentRouter);
app.use(getPhoneRouter);
app.use(getPaymentsRouter);
app.use(deletePaymentsRouter);
app.use(getOfferByPhNo);
app.use(useOfferRouter);

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