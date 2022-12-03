import express, { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user-model';
import { Email } from '../services/email';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { Password } from '../services/password';
import { generateToken, getToken, validateToken } from '../services/jwt';
import { DatabaseError } from '../errors/database-error';

const router = express.Router();

router.post('/forgotpass', [
    body('email')
        .isEmail()
        .withMessage('email not valid')
], async (req: Request, res: Response) => {
    // checking for valid token
    let token = getToken(req);
    const decoded = validateToken(token);

    // checking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // updating password in database
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        throw new BadRequestError('email not found');
    const password = randomBytes(4).toString('hex');
    const hashedPassword = await Password.toHash(password);
    const mongoRes = await User.findOneAndUpdate({ email }, { password: hashedPassword });
    if (!mongoRes)
        throw new DatabaseError(); // Database error only can happen here

    // sending email
    const content = `
    Your password has been changed to ${password}.
    Change your password as soon as possible.`;
    Email.sendMail(email, 'Change Password Request', content);

    // generating token
    token = generateToken(decoded.operator, user.id);

    res.status(200).send({ token, message: 'updated and email sent' });
});

export { router as forgotPassRouter };