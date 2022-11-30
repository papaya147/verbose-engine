import express, { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import axios from 'axios';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user-model';
import { APIKey } from '../services/apikey';
import { Email } from '../services/email';
import { ForwardError } from '../errors/forward-error';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { Password } from '../services/password';

const router = express.Router();

router.post('/auth/forgotpass', [
    body('email')
        .isEmail()
        .withMessage('Email not valid')
], async (req: Request, res: Response) => {
    const { key: suppliedKey, secret: suppliedSecret } = req.body;

    const flag = await APIKey.checkKey(suppliedKey, suppliedSecret);
    if (!flag)
        throw new BadRequestError('API service unavailable');

    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        throw new BadRequestError('Email not registered')

    const password = randomBytes(4).toString('hex');

    const hashedPassword = await Password.toHash(password);
    const mongoRes = await User.findOneAndUpdate({ email }, { password: hashedPassword });
    if (!mongoRes)
        throw new BadRequestError('Databse error'); // Database error only can happen here

    const content = `
    Your password has been changed to ${password}.
    Change your password as soon as possible.`;
    Email.sendMail(email, 'Change Password Request', content);

    res.status(200).send({ email, message: 'updated and email sent' });
});

export { router as forgotPassRouter };