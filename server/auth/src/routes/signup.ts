// modules
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

// errors
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';

// models
import { User } from '../models/user-model';
import { APIKey } from '../middlewares/apikey';

const router = express.Router();

router.post('/auth/signup', [
    body('email')
        .isEmail()
        .withMessage('Email not valid'),
    body('password')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters')
], async (req: Request, res: Response) => {
    const suppliedKey = req.get('key');
    const suppliedSecret = req.get('secret');

    const flag = await APIKey.checkKey(suppliedKey, suppliedSecret);
    if (!flag)
        throw new BadRequestError('API service unavailable');

    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { email, phoneNumber, password } = req.body;

    if (phoneNumber.length != 10)
        throw new BadRequestError('Phone number must either be empty or 10 digits');

    const existingUser = await User.findOne({ email });

    if (existingUser)
        throw new BadRequestError('Email already exists');

    const user = User.build({ email, phoneNumber, password });
    await user.save();

    // create session cookies

    res.status(201).send('Created');
});

export { router as signUpRouter };