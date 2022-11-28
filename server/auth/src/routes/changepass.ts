import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { APIKey } from '../services/apikey';
import { Password } from '../services/password';

const router = express.Router();

router.put('/auth/changepass', [
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

    const { id, email, password } = req.body;
    const hashedPassword = await Password.toHash(password);
    const idObject = new mongoose.Types.ObjectId(id);
    const mongoRes = await User.findOneAndUpdate({ _id: idObject, email }, { password: hashedPassword });

    if (!mongoRes)
        throw new BadRequestError('ID and email do not correspond')

    res.send({
        id,
        email,
        message: 'updated'
    });
});

export { router as changePassRouter };