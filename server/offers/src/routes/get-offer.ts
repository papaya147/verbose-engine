import express, { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error';
import { JwtValidationError } from '../errors/jwt-validation-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { Offer } from '../models/offer-model';
import { getToken, validateToken } from '../services/jwt';

const router = express.Router();

router.get('/getoffer', [
    query('id')
        .isHexadecimal()
        .isLength({ min: 24, max: 24 })
        .withMessage('offer id invalid')
], async (req: Request, res: Response) => {
    // getting user id
    const userId = validateToken(getToken(req)).userId;
    if (!userId)
        throw new JwtValidationError('userId');

    // checking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { id } = req.query;
    if (!id)
        throw new BadRequestError('offer id invalid');
    const offer = await Offer.findOne({
        _id: new mongoose.Types.ObjectId(id.toString()),
        user: new mongoose.Types.ObjectId(userId)
    });
    if (!offer)
        throw new BadRequestError('offer does not exist')
    const refinedOffer = {
        id: offer.id,
        type: offer.type,
        amount: offer.amount,
        discount: offer.discount,
        starts: new Date(offer.startsAt).toLocaleDateString(),
        ends: new Date(offer.expiresAt).toLocaleDateString()
    };
    res.send(refinedOffer);
});

export { router as getOfferRouter };