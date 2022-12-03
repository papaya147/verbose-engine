import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { checkUserRouter } from './routes/check-user';
import { createUserRouter } from './routes/create-user';
import { changePassRouter } from './routes/change-password';
import { forgotPassRouter } from './routes/forgot-password';
import { fetchUserRouter } from './routes/fetch-user';
import { randomBytes } from 'crypto';
import { Password } from './services/password';

const app = express();
app.use(json());

app.use(checkUserRouter);
app.use(createUserRouter);
app.use(changePassRouter);
app.use(forgotPassRouter);
app.use(fetchUserRouter);

app.post('/', async (req, res) => {
    const random = randomBytes(8).toString('hex');
    console.log(await Password.toHash(random));
});

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

    app.listen(4001, () => {
        console.log('Auth listening on 4001');
    });
};

start();