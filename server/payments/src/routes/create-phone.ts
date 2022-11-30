import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { Phone } from '../models/phone-model';
import { APIKey } from '../services/apikey';

const router = express.Router();

router.post('/payments/createphone', [
    body('phoneNumber')
        .isMobilePhone('en-IN')
        .withMessage('Phone number invalid')
], async (req: Request, res: Response) => {
    const { key: suppliedKey, secret: suppliedSecret } = req.body;

    const flag = await APIKey.checkKey(suppliedKey, suppliedSecret);
    if (!flag)
        throw new BadRequestError('API service unavailable');

    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { phoneNumber } = req.body;
    let { name } = req.body;
    if (!name)
        name = 'John Doe';

    const phoneExists = await Phone.findOne({ phoneNumber });
    if (phoneExists)
        throw new BadRequestError('Phone number in use');

    const phone = Phone.build({ phoneNumber, name });
    await phone.save();

    res.status(201).send({ id: phone.id, message: 'created' });
})

export { router as createPhoneRouter };