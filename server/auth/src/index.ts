import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import session from 'express-session';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { checkUserRouter } from './routes/checkuser';
import { createUserRouter } from './routes/createuser';
import { changePassRouter } from './routes/changepass';
import { forgotPassRouter } from './routes/forgotpass';

const app = express();
app.use(json());

app.use(checkUserRouter);
app.use(createUserRouter);
app.use(changePassRouter);
app.use(forgotPassRouter);

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