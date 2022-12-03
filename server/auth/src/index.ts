import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { jwtTokenRouter } from './routes/get-jwt-token';
import { jwtChecker } from './middlewares/jwt-checker';
import { signUpRouter } from './routes/sign-up';
import { signInRouter } from './routes/sign-in';
import { loginRouter } from './routes/login';
import { changePassRouter } from './routes/change-password';
import { forgotPassRouter } from './routes/forgot-password';

const app = express();
app.use(json());

app.use(jwtTokenRouter);

app.use(jwtChecker);

app.use(loginRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(changePassRouter);
app.use(forgotPassRouter);

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

    app.listen(4001, () => {
        console.log('Auth listening on 4001');
    });
};

start();
