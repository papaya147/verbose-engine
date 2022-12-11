import express from 'express';
import { Offer, OfferDocument } from '../models/offer-model';
import { getToken, validateToken } from '../services/jwt';

const router = express.Router();

const refineOffers = (offers: OfferDocument[]) => {
    return offers.map(offer => {
        return {
            id: offer.id,
            type: offer.type,
            amount: offer.amount,
            discount: offer.discount,
            starts: new Date(offer.startsAt).toLocaleDateString(),
            ends: new Date(offer.expiresAt).toLocaleDateString()
        }
    });
};

router.get('/getalloffers', async (req, res) => {
    // fetching user id
    const userId = validateToken(getToken(req)).userId;

    // fetching offers yet to start with user id after current time
    const offers_future = await Offer.find({
        user: userId,
        startsAt: {
            $gt: new Date()
        }
    }).sort({ startsAt: 'asc' });
    const offers_past = await Offer.find({
        user: userId,
        expiresAt: {
            $lt: new Date()
        }
    }).sort({ startsAt: 'asc' });
    const offers_present = await Offer.find({
        user: userId,
        startsAt: {
            $lte: new Date()
        },
        expiresAt: {
            $gte: new Date()
        }
    }).sort({ startsAt: 'asc' });
    const future = refineOffers(offers_future);
    const past = refineOffers(offers_past);
    const present = refineOffers(offers_present);

    res.send({ past, present, future });
});

export { router as getAllOffersRouter };