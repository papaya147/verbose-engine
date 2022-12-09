import express from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { Payment } from '../models/payment-model';
import { Phone } from '../models/phone-model';
import { getToken, validateToken } from '../services/jwt';

const router = express.Router();

// only use for dev purposes
router.delete('/', async (req, res) => {
    const operator = validateToken(getToken(req)).operator;
    if (operator && !(operator === 'Abhinav Srivatsa'))
        throw new BadRequestError('unauthorised');

    await Payment.deleteMany({});
    await Phone.deleteMany({});
    res.send({ message: 'deleted' });
});

export { router as deletePaymentsRouter };