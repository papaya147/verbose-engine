import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import axios from 'axios';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { Phone } from '../models/phone-model';
import { APIKey } from '../services/apikey';
import { ForwardError } from '../errors/forward-error';
import mongoose from 'mongoose';
import { Payment } from '../models/payment-model';

const router = express.Router();

router.post('/payments/createpayment', [
    body('id')
        .isLength({ min: 24, max: 24 })
        .isHexadecimal()
        .withMessage('ID should be a 24 character hexadecimal value'),
    body('phoneNumber')
        .isMobilePhone('en-IN')
        .withMessage('Phone number invalid'),
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
], async (req: Request, res: Response) => {
    const { key: suppliedKey, secret: suppliedSecret } = req.body;

    const flag = await APIKey.checkKey(suppliedKey, suppliedSecret);
    if (!flag)
        throw new BadRequestError('API service unavailable');

    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { id: userId, phoneNumber, name, amount, withQR } = req.body;

    const phone = await Phone.findOne({ phoneNumber });
    let phoneId;
    if (!phone) {
        const createResponse = await axios.post('http://localhost:4002/payments/createphone', {
            key: suppliedKey,
            secret: suppliedSecret,
            phoneNumber,
            name
        }).catch(err => {
            if (err.response)
                throw new ForwardError(err.response.status, err.response.data.errors);
        });
        if (createResponse)
            phoneId = createResponse.data.id;
    } else
        phoneId = phone.id;

    const userIdObject = new mongoose.Types.ObjectId(userId);
    const phoneIdObject = new mongoose.Types.ObjectId(phoneId);
    const payment = Payment.build({ userId: userIdObject, phoneId: phoneIdObject, amount });
    await payment.save();

    if (withQR === true) {
        const qr = await axios.post('http://localhost:4002/payments/createqr', {
            key: suppliedKey,
            secret: suppliedSecret,
            id: userId,
            amount
        }).catch(err => {
            if (err.response)
                throw new ForwardError(err.response.status, err.response.data.errors);
        });

        if (!qr)
            throw new BadRequestError('ID not valid');

        res.status(201).send(qr.data);
    } else
        res.status(201).send({ message: 'Created' });
});

export { router as createPaymentRouter };