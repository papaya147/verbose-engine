import express, { Request, response, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { RequestValidationError } from '../errors/request-validation-error';
import { Offer } from '../models/offer-model';
import { getToken, validateToken } from '../services/jwt';

const router = express.Router();

router.post('/createoffer', [
    body('type')
        .matches(/^visits$|^spent$|^none$|^$/)
        .withMessage('type is invalid'),
    body('amount')
        .isNumeric()
        .withMessage('amount is invalid'),
    body('discount')
        .matches(/\d{1,2}%|\d+/)
        .withMessage('discount is invalid'),
    body('starts')
        .matches(/\d{1,2}(\ |-|\/)\d{1,2}(\ |-|\/)\d{4}/)
        .withMessage('start date invalid'),
    body('expires')
        .matches(/\d{1,2}(\ |-|\/)\d{1,2}(\ |-|\/)\d{4}/)
        .withMessage('expire date invalid')
], async (req: Request, res: Response) => {
    // checking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // getting user id
    const userId = validateToken(getToken(req)).userId;

    // creating offer
    let { type } = req.body;
    if (type === undefined) type = 'none';
    const { amount, discount, starts, expires } = req.body;
    const startDate = new Date(starts.toString());
    const endDate = new Date(expires.toString());
    const offer = Offer.build({
        user: new mongoose.Types.ObjectId(userId),
        type,
        amount,
        discount,
        startsAt: startDate,
        expiresAt: endDate
    });
    await offer.save();

    res.status(201).send({ message: 'created' });
});

export { router as createOfferRouter };