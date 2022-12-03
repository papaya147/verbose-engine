import express, { Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { Password } from '../services/password';

const router = express.Router();

router.post('/auth/checkuser', [
    body('email')
        .isEmail()
        .withMessage('Email not valid'),
    body('password')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        throw new BadRequestError('Email not found');

    if (!await Password.compare(user.password, password))
        throw new BadRequestError('Password incorrect');

    res.status(200).send({ valid: true, message: 'correct' });
});

export { router as checkUserRouter };