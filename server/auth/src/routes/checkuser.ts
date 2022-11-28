import express, { Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { APIKey } from '../services/apikey';
import { Password } from '../services/password';

const router = express.Router();

router.post('/auth/checkuser', [
    body('email')
        .isEmail()
        .withMessage('Email not valid'),
    body('password')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters')
], async (req: Request, res: Response) => {
    const { key: suppliedKey, secret: suppliedSecret } = req.body;

    const flag = await APIKey.checkKey(suppliedKey, suppliedSecret);
    if (!flag)
        throw new BadRequestError('API service unavailable');

    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        throw new BadRequestError('Email not found');

    if (!await Password.compare(user.password, password))
        throw new BadRequestError('Password incorrect');

    res.status(200).send({
        id: user.id,
        email,
        upiAccount: user.upiAccount,
        upiName: user.upiName,
        valid: true,
        message: 'valid'
    });
});

export { router as checkUserRouter };