import express, { Request, response, Response } from 'express';
import { query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { RequestValidationError } from '../../../offers/src/errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import { Offer, OfferDocument } from '../models/offer-model';
import { Payment } from '../models/payment-model';
import { Phone } from '../models/phone-model';
import { getToken, validateToken } from '../services/jwt';

const router = express.Router();

const getOffers = async (offers: OfferDocument[], userId: string | undefined, phoneId: string | undefined) => {
    const offersAppl: any[] = []
    for (let x = 0; x < offers.length; x++) {
        const amount = offers[x].amount;
        let payment;
        switch (offers[x].type) {
            case 'spent':
                payment = await Payment.findOne({
                    user: new mongoose.Types.ObjectId(userId),
                    phone: new mongoose.Types.ObjectId(phoneId),
                    amount: {
                        $gte: amount
                    },
                    usedOffer: false
                });
                if (payment)
                    offersAppl.push({
                        offerId: offers[x].id,
                        paymentId: [payment.id],
                        discount: offers[x].discount
                    });
                break;
            case 'visits':
                payment = await Payment.find({
                    user: new mongoose.Types.ObjectId(userId),
                    phone: new mongoose.Types.ObjectId(phoneId),
                    usedOffer: false,
                });
                if (payment.length >= amount) {
                    const paymentId = payment.slice(0, amount).map(element => {
                        return element.id;
                    });
                    offersAppl.push({
                        offerId: offers[x].id,
                        paymentId,
                        discount: offers[x].discount
                    });
                }
                break;
            case 'none':
                offersAppl.push({
                    offerId: offers[x].id,
                    paymentId: [],
                    discount: offers[x].discount
                });
                break;
        }
    };
    return offersAppl;
}

router.get('/getoffers', [
    query('phoneNumber')
        .isMobilePhone('en-IN')
        .withMessage('phone number invalid')
], async (req: Request, res: Response) => {
    // fetching user id
    const userId = validateToken(getToken(req)).userId;

    // checking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // checking if phone exists
    const { phoneNumber } = req.query;
    if (!phoneNumber)
        throw new BadRequestError('phone number invalid');
    const phone = await Phone.findOne({ phoneNumber });
    if (!phone)
        throw new BadRequestError('phone number does not exist');

    // getting applicable offers
    const offers = await Offer.find({
        user: new mongoose.Types.ObjectId(userId),
        startsAt: { $lte: new Date() },
        expiresAt: { $gte: new Date() }
    });
    const offersAppl = await getOffers(offers, userId, phone.id);
    res.send(offersAppl);
});

export { router as getOfferByPhNo };