import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { generateToken, getToken, validateToken } from '../services/jwt';
import { Password } from '../services/password';

const router = express.Router();

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('email not valid'),
    body('phoneNumber')
        .matches(/^$|\d{10}/)
        .withMessage('phone number not valid'),
    body('upiAccount')
        .matches(/^$|^[a-zA-Z0-9_]+@[a-zA-Z0-9_]+$/)
        .withMessage('upi account invalid'),
    body('upiName')
        .matches(/^$|^[a-zA-Z0-9_\s]+$/)
        .withMessage('upi name invalid')
], async (req: Request, res: Response) => {
    // checking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // creating user
    const { email, phoneNumber, password, upiAccount, upiName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
        throw new BadRequestError('email already exists');
    const hashedPassword = await Password.toHash(password);
    const user = User.build({ email, phoneNumber, password: hashedPassword, upiAccount, upiName });
    await user.save();

    // generating token
    let token = getToken(req);
    const decoded = validateToken(token);
    token = generateToken(decoded.operator, user.id);

    res.status(201).send({ token, message: 'created' });
});

export { router as signUpRouter };