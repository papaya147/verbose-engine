import express, { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { Payment } from '../models/payment-model';
import { Phone } from '../models/phone-model';
import { getToken, validateToken } from '../services/jwt';

const router = express.Router();

router.get('/payments', [
    query('fromDate')
        .matches(/\d{1,2}(\ |-|\/)\d{1,2}(\ |-|\/)\d{4}/)
        .withMessage('from date invalid, format: mm/dd/yyyy'),
    query('toDate')
        .matches(/\d{1,2}(\ |-|\/)\d{1,2}(\ |-|\/)\d{4}/)
        .withMessage('to date invalid, format: mm/dd/yyyy')
], async (req: Request, res: Response) => {
    // getting user id from token
    const userId = validateToken(getToken(req)).userId;
    if (!userId)
        throw new BadRequestError('user id invalid');

    // checking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // getting results from - to
    const { fromDate, toDate } = req.query;
    if (!fromDate || !toDate)
        throw new BadRequestError('from or to date not provided');
    const from = new Date(fromDate.toString());
    const to = new Date(toDate.toString()).setHours(23, 59, 59);
    const payments = await Payment.find({
        user: new mongoose.Types.ObjectId(userId),
        createdAt: {
            $gte: from,
            $lt: to
        }
    }).populate('phone').sort({ createdAt: 'asc' });

    const paymentsRefined = payments.map(payment => {
        if (payment.phone instanceof Phone)
            return {
                phone: payment.phone.phoneNumber,
                amount: payment.amount,
                date: payment.createdAt
            };
    });

    res.status(200).send(paymentsRefined);
});

export { router as getPaymentsRouter };