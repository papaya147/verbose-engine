import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';

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

const start = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/coupons");
        console.log("Connected to MongoDb");
    } catch (err) {
        console.error(err);
    }

    app.listen(4000, () => {
        console.log("Listening on port 4000");
    });
};

start();