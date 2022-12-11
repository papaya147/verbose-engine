import express, { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { Offer } from '../models/offer-model';
import { getToken, validateToken } from '../services/jwt';

const router = express.Router();

router.delete('/deleteoffer', [
    query('id')
        .isHexadecimal()
        .isLength({ min: 24, max: 24 })
        .withMessage('offer id is invalid')
], async (req: Request, res: Response) => {
    // fetching user id from jwt
    const userId = validateToken(getToken(req)).userId;

    // checking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // deleting
    const { id } = req.query;
    if (!id)
        throw new BadRequestError('offer id is invalid');
    await Offer.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(id.toString()),
        user: new mongoose.Types.ObjectId(userId)
    });
    res.status(200).send({ message: 'deleted' });
});

export { router as deleteOfferRouter };