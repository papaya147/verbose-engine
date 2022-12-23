import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { Payment } from '../models/payment-model';

const router = express.Router();

router.post('/useoffer', [
    body('payments')
        .isArray()
        .withMessage('payments array invalid')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // need more validation to check payment id
    const { payments } = req.body;
    if (!payments)
        throw new BadRequestError('payments invalid');

    payments.map(async (payment: any) => {
        await Payment.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(payment) }, { usedOffer: true });
    });

    res.send({ message: 'updated' });
});

export { router as useOfferRouter };