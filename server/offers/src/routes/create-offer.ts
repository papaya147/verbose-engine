import axios from 'axios';
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error';
import { ForwardError } from '../errors/forward-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { Offer } from '../models/offer-model';
import { APIKey } from '../services/apikey';

const router = express.Router();

router.post('/offers/createoffer', [
    body('id')
        .isLength({ min: 24, max: 24 })
        .isHexadecimal()
        .withMessage('ID should be a 24 character hexadecimal value'),
    body('discount')
        .matches(/\d{1,2}%|\d+/)
        .withMessage('Discount must either be percentage or numeric'),
    body('starts')
        .matches(/\d{1,2}(\ |-|\/)\d{1,2}(\ |-|\/)\d{4}/)
        .withMessage('Start date invalid'),
    body('expires')
        .matches(/\d{1,2}(\ |-|\/)\d{1,2}(\ |-|\/)\d{4}/)
        .withMessage('Expire date invalid')
], async (req: Request, res: Response) => {
    const { key: suppliedKey, secret: suppliedSecret } = req.body;

    const flag = await APIKey.checkKey(suppliedKey, suppliedSecret);
    if (!flag)
        throw new BadRequestError('API service unavailable');

    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { id: userId, type, amount, discount, starts, expires } = req.body;

    const user = await axios.post('http://localhost:4001/auth/fetchuser', {
        key: suppliedKey,
        secret: suppliedSecret,
        id: userId
    }).catch(err => {
        if (err.response)
            throw new ForwardError(err.response.status, err.response.data.errors);
    });
    if (!user)
        throw new BadRequestError('User ID does not exist');

    if (type !== 'visits' && type !== 'spent' && type !== 'none')
        throw new BadRequestError('Invalid field type');

    if (type !== 'none' && !amount)
        throw new BadRequestError('Amount invalid for option type');

    const offer = Offer.build({
        userId: new mongoose.Types.ObjectId(userId),
        type,
        amount,
        discount,
        startsAt: new Date(starts),
        expiresAt: new Date(expires)
    });
    await offer.save();

    res.status(201).send({ message: 'created' });
});

export { router as createOfferRouter };