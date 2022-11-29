import express, { Request, Response } from 'express';
import axios from 'axios';
import qrcode from 'qrcode';
import { BadRequestError } from '../errors/bad-request-error';
import { APIKey } from '../services/apikey';
import { ForwardError } from '../errors/forward-error';

const router = express.Router();

router.post('/payments/createqr', [

], async (req: Request, res: Response) => {
    const { key: suppliedKey, secret: suppliedSecret } = req.body;

    const flag = await APIKey.checkKey(suppliedKey, suppliedSecret);
    if (!flag)
        throw new BadRequestError('API service unavailable');

    const { id, email, amount } = req.body;

    const accountResponse = await axios.post('http://localhost:4001/auth/fetchuser', {
        key: suppliedKey,
        secret: suppliedSecret,
        id,
        email
    }).catch(err => {
        if (err.response)
            throw new ForwardError(err.response.status, err.response.data.errors);
    });

    if (!accountResponse)
        throw new BadRequestError('ID and Email do not correspond');

    const { upiAccount, upiName } = accountResponse.data;
    const payUrl = `upi://pay?pa=${upiAccount}&pn=${upiName}&cu=INR&am=${amount}`;

    qrcode.toString(payUrl, { type: 'svg' }, (err, src) => {
        if (err)
            res.send('An error occured');
        res.send(src);
    });
})

export { router as createQRCodeRouter };