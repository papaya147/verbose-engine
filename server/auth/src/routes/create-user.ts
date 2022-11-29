import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { APIKey } from '../services/apikey';

const router = express.Router();

router.post('/auth/createuser', [
    body('email')
        .isEmail()
        .withMessage('Email not valid'),
    body('password')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters'),
    body('upiAccount')
        .matches(/.+@.+/)
        .withMessage('UPI account invalid'),
    body('upiName')
        .isAlphanumeric('en-US', { ignore: '\s' })
        .withMessage('UPI name invalid')
], async (req: Request, res: Response) => {
    const { key: suppliedKey, secret: suppliedSecret } = req.body;

    const flag = await APIKey.checkKey(suppliedKey, suppliedSecret);
    if (!flag)
        throw new BadRequestError('API service unavailable');

    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { email, phoneNumber, password, upiAccount, upiName } = req.body;

    const isnum = /^\d+$/.test(phoneNumber);

    if (phoneNumber.length !== 0 && (phoneNumber.length !== 10 || !isnum))
        throw new BadRequestError('Phone number must either be empty or 10 digits');

    const existingUser = await User.findOne({ email });
    if (existingUser)
        throw new BadRequestError('Email already exists');

    const user = User.build({ email, phoneNumber, password, upiAccount, upiName });
    await user.save();

    res.status(201).send({ message: 'created' });
});

export { router as createUserRouter };