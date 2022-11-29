import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { Phone } from '../models/phone-model';
import { APIKey } from '../services/apikey';

const router = express.Router();

router.post('/payments/phone', [
    body('phoneNumber')
        .isNumeric()
        .withMessage('Phone number must be numeric')
        .isLength({ max: 10 })
        .withMessage('Phone number must be less than or equal to 10 numbers')
], async (req: Request, res: Response) => {
    const { key: suppliedKey, secret: suppliedSecret } = req.body;

    const flag = await APIKey.checkKey(suppliedKey, suppliedSecret);
    if (!flag)
        throw new BadRequestError('API service unavailable');

    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { phoneNumber } = req.body;
    const regex = new RegExp('^' + phoneNumber);
    const phone = await Phone.find({ phoneNumber: regex });

    if (phone.length === 0)
        throw new BadRequestError('Phone number does not exist on servers');

    res.send(phone.map(data => {
        return { phoneNumber: data.phoneNumber, name: data.name };
    }));
});

export { router as getPhoneRouter };