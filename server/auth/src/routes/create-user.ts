import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { APIKey } from '../services/apikey';
import { Password } from '../services/password';

const router = express.Router();

router.post('/auth/createuser', [
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

    const { email, phoneNumber, password, upiAccount, upiName } = req.body;

    const isnum = /^\d+$/.test(phoneNumber);

    if (phoneNumber.length !== 0 && (phoneNumber.length !== 10 || !isnum))
        throw new BadRequestError('Phone number must either be empty or 10 digits');

    if (upiAccount && !(/.+@.+/.test(upiAccount)))
        throw new BadRequestError('UPI account invalid');

    if (upiName && !(/^[a-zA-Z0-9_\s]*$/.test(upiName)))
        throw new BadRequestError('UPI name invalid');

    const existingUser = await User.findOne({ email });
    if (existingUser)
        throw new BadRequestError('Email already exists');

    const hashedPassword = await Password.toHash(password);

    const user = User.build({ email, phoneNumber, password: hashedPassword, upiAccount, upiName });
    await user.save();

    res.status(201).send({ message: 'created' });
});

export { router as createUserRouter };