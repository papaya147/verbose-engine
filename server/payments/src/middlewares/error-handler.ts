import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof CustomError) {
        console.log(err);
        return res.status(err.statusCode).send({ errors: err.serialiseErrors() });
    }

    console.log(err.stack);
    console.log(err.message);
    res.status(400).send({
        errors: [{ message: err.message }]
    });
};
