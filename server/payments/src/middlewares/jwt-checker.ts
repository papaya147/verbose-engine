import { NextFunction, Request, Response } from "express"
import mongoose from "mongoose";
import { BadRequestError } from "../errors/bad-request-error";
import { JwtValidationError } from "../errors/jwt-validation-error";
import { User } from "../models/user-model";
import { getToken, validateToken } from "../services/jwt";

export const jwtChecker = async (req: Request, res: Response, next: NextFunction) => {
    const token = getToken(req);
    const decoded = validateToken(token);
    if (decoded.userId === undefined)
        throw new JwtValidationError('userId');
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(decoded.userId) });
    if (!user)
        throw new BadRequestError('user id invalid');
    next();
};