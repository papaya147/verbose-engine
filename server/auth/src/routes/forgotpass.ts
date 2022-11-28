import express, { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import axios from 'axios';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user-model';
import { APIKey } from '../services/apikey';
import { Email } from '../services/email';
import { ForwardError } from '../errors/forward-error';

const router = express.Router();

router.post('/auth/forgotpass', async (req: Request, res: Response) => {
    const { key: suppliedKey, secret: suppliedSecret } = req.body;

    const flag = await APIKey.checkKey(suppliedKey, suppliedSecret);
    if (!flag)
        throw new BadRequestError('API service unavailable');

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        throw new BadRequestError('Email not registered')

    const password = randomBytes(4).toString('hex');

    const updateRes = await axios.put('http://localhost:4001/auth/changepass',
        {
            key: suppliedKey,
            secret: suppliedSecret,
            id: user.id,
            email,
            password
        }
    ).catch(err => {
        if (err.response)
            throw new ForwardError(err.response.status, err.response.data.errors);
    });

    const content = `
    Your password has been changed to ${password}.
    Change your password as soon as possible.`;
    Email.sendMail(email, 'Change Password Request', content);

    res.status(200).send({ id: user.id, email, message: 'updated and email sent' });
});

export { router as forgotPassRouter };