import express, { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { Phone } from '../models/phone-model';

const router = express.Router();

router.get('/phone', [
    query('phoneNumber')
        .isNumeric()
        .isLength({ max: 10 })
        .withMessage('phone number invalid')
], async (req: Request, res: Response) => {
    // checking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // fetching phone numbers
    const { phoneNumber } = req.query;
    const regex = new RegExp('^' + phoneNumber);
    const phone = await Phone.find({ phoneNumber: regex });
    if (phone.length === 0)
        throw new BadRequestError('phone number not found');
    const phoneArray = phone.map(data => {
        return { phoneNumber: data.phoneNumber, name: data.name };
    });
    res.send({ phoneArray });
});

export { router as getPhoneRouter };