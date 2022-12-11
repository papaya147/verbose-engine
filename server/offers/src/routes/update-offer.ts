import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { RequestValidationError } from '../errors/request-validation-error';
import { Offer } from '../models/offer-model';
import { getToken, validateToken } from '../services/jwt';

const router = express.Router();

router.put('/updateoffer', [
    body('id')
        .isHexadecimal()
        .isLength({ min: 24, max: 24 })
        .withMessage('offer id is invalid'),
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
    // fetching user id from jwt
    const userId = validateToken(getToken(req)).userId;

    // checking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // updating
    const { id, type, amount, discount, starts, expires } = req.body;
    const offer = await Offer.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(id),
        user: new mongoose.Types.ObjectId(userId)
    }, {
        type,
        amount,
        discount,
        startsAt: new Date(starts),
        expiresAt: new Date(expires)
    });
    res.status(200).send({ message: 'updated' });
});

export { router as updateOfferRouter };