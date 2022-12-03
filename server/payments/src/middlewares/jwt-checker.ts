import { NextFunction, Request, Response } from "express"
import { JwtValidationError } from "../errors/jwt-validation-error";
import { getToken, validateToken } from "../services/jwt";

export const jwtChecker = async (req: Request, res: Response, next: NextFunction) => {
    const token = getToken(req);
    const decoded = validateToken(token);
    if (decoded.userId === undefined)
        throw new JwtValidationError('userId');
    next();
};