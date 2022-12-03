import { NextFunction, Request, Response } from "express"
import { getToken, validateToken } from "../services/jwt";

export const jwtChecker = async (req: Request, res: Response, next: NextFunction) => {
    const token = getToken(req);
    validateToken(token);
    next();
};