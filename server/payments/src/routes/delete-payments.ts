import express from 'express';
import { Payment } from '../models/payment-model';
import { Phone } from '../models/phone-model';

const router = express.Router();

// only use for dev purposes
router.delete('/', async (req, res) => {
    await Payment.deleteMany({});
    await Phone.deleteMany({});
    res.send({ message: 'deleted' });
});

export { router as deletePaymentsRouter };