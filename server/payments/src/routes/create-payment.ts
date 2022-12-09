import express, { Request, response, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { RequestValidationError } from '../errors/request-validation-error';
import { Payment } from '../models/payment-model';
import { Phone } from '../models/phone-model';
import { User } from '../models/user-model';
import { getToken, validateToken } from '../services/jwt';
import qrcode from 'qrcode';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/createpayment', [
    body('phoneNumber')
        .isMobilePhone('en-IN')
        .withMessage('phone number invalid'),
    body('name')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('name invalid'),
    body('amount')
        .isNumeric()
        .withMessage('amount invalid'),
    body('offerId')
        .matches(/^$|^[0-9a-fA-F]{24}$/)
        .withMessage('offer id invalid'),
    body('qr')
        .matches(/^$|^true$|^false$/)
        .withMessage('withqr invalid')
], async (req: Request, res: Response) => {
    // cheking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // checking if phone exists, creating otherwise
    const { phoneNumber, amount } = req.body;
    let { name } = req.body;
    if (!name || name.length === 0)
        name = 'John Doe';
    const phone = await Phone.findOne({ phoneNumber });
    let phoneId;
    if (!phone) {
        const newPhone = Phone.build({ phoneNumber, name });
        await newPhone.save();
        phoneId = newPhone.id;
    }
    if (phone && name !== 'John Doe') {
        await Phone.findOneAndUpdate({ phoneNumber }, { name });
        phoneId = phone.id;
    }

    // getting user id from jwt
    const userId = validateToken(getToken(req)).userId;

    // getting offer id from request
    const { offerId } = req.body;

    // creating payment
    if (offerId === undefined || offerId === '')
        Payment.build({
            user: new mongoose.Types.ObjectId(userId),
            phone: new mongoose.Types.ObjectId(phoneId),
            amount
        }).save();
    else
        Payment.build({
            user: new mongoose.Types.ObjectId(userId),
            phone: new mongoose.Types.ObjectId(phoneId),
            amount,
            offer: new mongoose.Types.ObjectId(offerId)
        }).save();

    // generating qr code if needed
    const { qr } = req.body;
    if (qr === 'true' || qr === true) {
        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
        if (!user)
            throw new BadRequestError('user not found');
        if (!user.upiAccount || !user.upiName)
            throw new BadRequestError('upi account or name invalid for user');
        const payUrl = `upi://pay?pa=${user.upiAccount}&pn=${user.upiName}&cu=INR&am=${amount}`;
        qrcode.toString(payUrl, { type: 'svg' }, (err, src) => {
            if (err)
                res.send({ message: 'payment created, qr error' });
            else
                res.send({ message: 'payment and qr created', qr: src });
        });
    } else
        res.send({ message: 'created' });
});

export { router as createPaymentRouter };