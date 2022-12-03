import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { Request } from 'express';
import { BadRequestError } from '../errors/bad-request-error';

const generateToken = (operator: string | undefined, id: string | undefined = undefined) => {
    const payload = {
        userId: id,
        operator
    };
    const privateKey = {
        key: fs.readFileSync(path.join(__dirname, './../../../private.pem')),
        passphrase: 'lone stormy night'
    };
    const signOptions: SignOptions = {
        algorithm: 'RS256'
    };
    return sign(payload, privateKey, signOptions);
};

interface payloadAttrs {
    userId: string | undefined;
    operator: string | undefined;
}

const validateToken = (token: string): payloadAttrs => {
    const publicKey = fs.readFileSync(path.join(__dirname, './../../../public.pem'));
    const verifyOptions: VerifyOptions = {
        algorithms: ['RS256']
    };
    return verify(token, publicKey, verifyOptions) as payloadAttrs;
};

const getToken = (req: Request): string => {
    let jwt = req.headers.authorization;
    if (!jwt)
        throw new BadRequestError('jwt not provided');
    if (jwt.toLowerCase().startsWith('bearer'))
        jwt = jwt.slice('bearer'.length).trim();
    return jwt;
}

export { generateToken, validateToken, getToken };