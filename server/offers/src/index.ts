import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from './middlewares/error-handler';
import mongoose from 'mongoose';
import { NotFoundError } from './errors/not-found-error';
import { createOfferRouter } from './routes/create-offer';
import { jwtChecker } from './middlewares/jwt-checker';
import { getAllOffersRouter } from './routes/get-all-offers';
import { getOfferRouter } from './routes/get-offer';
import { updateOfferRouter } from './routes/update-offer';
import { deleteOfferRouter } from './routes/delete-offer';

const app = express();
app.use(json());

app.use(jwtChecker);
app.use(createOfferRouter);
app.use(getAllOffersRouter);
app.use(getOfferRouter);
app.use(updateOfferRouter);
app.use(deleteOfferRouter);

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