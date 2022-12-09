import express from 'express';
import { Offer } from '../models/offer-model';
import { getToken, validateToken } from '../services/jwt';

const router = express.Router();

router.get('/getoffers', async (req, res) => {
    // fetching user id
    const userId = validateToken(getToken(req)).userId;

    // fetching offers with user id after current time
    const offers = await Offer.find({
        user: userId,
        startsAt: {
            $gt: new Date()
        }
    });
    const offersRefined = offers.map(offer => {
        return {
            id: offer.id,
            type: offer.type,
            amount: offer.amount,
            discount: offer.discount,
            starts: new Date(offer.startsAt).toLocaleDateString(),
            ends: new Date(offer.expiresAt).toLocaleDateString()
        }
    });

    res.send(offersRefined);
});

export { router as getOffersRouter };