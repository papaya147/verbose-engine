import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { APIKey } from '../services/apikey';

const router = express.Router();

router.post('/auth/fetchuser', [
    body('id')
        .isLength({ min: 24, max: 24 })
        .isHexadecimal()
        .withMessage('ID should be a 24 character hexadecimal value'),
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

    const { id, email } = req.body;

    const idObject = new mongoose.Types.ObjectId(id);
    const user = await User.findOne({ _id: idObject, email });
    if (!user)
        throw new BadRequestError('ID and email do not correspond');

    res.status(200).send({
        id: user.id,
        email,
        upiAccount: user.upiAccount,
        upiName: user.upiName,
        message: 'fetched'
    });
});

export { router as fetchUserRouter };