import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from './middlewares/error-handler';
import mongoose from 'mongoose';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());



app.all('*', (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/coupons");
        console.log("Connected to MongoDb");
    } catch (err) {
        console.error(err);
    }

    app.listen(4003, () => {
        console.log('Offers listening on 4003')
    });
}

start();