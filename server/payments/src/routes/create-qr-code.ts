import express, { Request, Response } from 'express';
import axios from 'axios';
import qrcode from 'qrcode';
import { BadRequestError } from '../errors/bad-request-error';
import { APIKey } from '../services/apikey';
import { ForwardError } from '../errors/forward-error';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post('/payments/createqr', [
    body('id')
        .isLength({ min: 24, max: 24 })
        .isHexadecimal()
        .withMessage('ID should be a 24 character hexadecimal value'),
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

    const { id, amount } = req.body;

    const accountResponse = await axios.post('http://localhost:4001/auth/fetchuser', {
        key: suppliedKey,
        secret: suppliedSecret,
        id
    }).catch(err => {
        if (err.response)
            throw new ForwardError(err.response.status, err.response.data.errors);
    });

    if (!accountResponse)
        throw new BadRequestError('ID invalid');

    const { upiAccount, upiName } = accountResponse.data;
    if (!upiAccount || !upiName)
        throw new BadRequestError('UPI account or name not setup');

    const payUrl = `upi://pay?pa=${upiAccount}&pn=${upiName}&cu=INR&am=${amount}`;

    qrcode.toString(payUrl, { type: 'svg' }, (err, src) => {
        if (err)
            res.send('An error occured');
        res.send(src);
    });
})

export { router as createQRCodeRouter };