import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { Collaborator } from '../models/collaborator-model';
import { generateToken } from '../services/jwt';
import { Password } from '../services/password';

const router = express.Router();

router.post('/tokenise', [
    body('name')
        .matches(/^[a-zA-Z_\s]*$/)
        .withMessage('name must be alphabetic')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { name, password } = req.body;
    const collab = await Collaborator.findOne({ name });
    if (!collab)
        throw new BadRequestError('name not found');
    if (!await Password.compare(collab.password, password))
        throw new BadRequestError('password incorrect');

    const token = generateToken(name);
    res.status(200).send({ token });
});

export { router as jwtTokenRouter };