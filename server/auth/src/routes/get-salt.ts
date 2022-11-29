import express, { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { APIKey } from '../services/apikey';
import { User } from '../models/user-model';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/auth/getsalt', [
    body('id')
        .isLength({ min: 24, max: 24 })
        .isHexadecimal()
        .withMessage('ID should be a 24 character hexadecimal value')
], async (req: Request, res: Response) => {
    const { key: suppliedKey, secret: suppliedSecret } = req.body;

    const flag = await APIKey.checkKey(suppliedKey, suppliedSecret);
    if (!flag)
        throw new BadRequestError('API service unavailable');

    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { id } = req.body;
    const user = await User.findById({ _id: new mongoose.Types.ObjectId(id) });

    if (!user)
        throw new BadRequestError('ID invalid');

    const [hashedPassword, salt] = user.password.split('.');
    res.status(200).send({ salt, message: 'fetched' });
});

export { router as getSaltRouter };