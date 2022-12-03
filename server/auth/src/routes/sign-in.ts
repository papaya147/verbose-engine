import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { getToken, validateToken, generateToken } from '../services/jwt';
import { Password } from '../services/password';

const router = express.Router();

router.post('/signin', [
    body('email')
        .isEmail()
        .withMessage('email not valid')
], async (req: Request, res: Response) => {
    // checking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // validating login
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        throw new BadRequestError('email not found');
    if (!await Password.compare(user.password, password))
        throw new BadRequestError('password incorrect');

    // generating token
    let token = getToken(req);
    const decoded = validateToken(token);
    token = generateToken(decoded.operator, user.id);

    res.status(200).send({ token, valid: true, message: 'correct' });
});

export { router as signInRouter };