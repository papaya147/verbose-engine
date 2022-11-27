// modules
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

// routes
import { createAPIKeyRouter } from './routes/create-api-key';
import { checkAPIKeyRouter } from './routes/check-api-key';

// errors
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';

const app = express();
app.use(json());

app.use(createAPIKeyRouter);
app.use(checkAPIKeyRouter);

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
        console.log("API listening on port 4000");
    });
};

start();