import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error';
import { JwtValidationError } from '../errors/jwt-validation-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { getToken, validateToken } from '../services/jwt';
import { Password } from '../services/password';

const router = express.Router();

router.put('/changepass', [
    body('email')
        .isEmail()
        .withMessage('email not valid')
], async (req: Request, res: Response) => {
    // checking for valid token
    let token = getToken(req);
    const decoded = validateToken(token);
    if (decoded.userId === undefined)
        throw new JwtValidationError('missing property in jwt token', 'userId');

    // checking input errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    // finding email and password
    const id = decoded.userId;
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(id), email });
    if (!user)
        throw new BadRequestError('id or email not found');
    if (!await Password.compare(user.password, oldPassword))
        throw new BadRequestError('old password incorrect');
    const hashedPassword = await Password.toHash(newPassword);
    await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id), email },
        { password: hashedPassword }
    );

    res.send({ message: 'updated' });
});

export { router as changePassRouter };