import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from './middlewares/error-handler';
import mongoose from 'mongoose';
import { NotFoundError } from './errors/not-found-error';
import { createOfferRouter } from './routes/create-offer';
import { jwtChecker } from './middlewares/jwt-checker';
import { getOffersRouter } from './routes/get-offers';

const app = express();
app.use(json());

app.use(jwtChecker);
app.use(createOfferRouter);
app.use(getOffersRouter);

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

    app.listen(4003, () => {
        console.log('Offers listening on 4003')
    });
}

start();