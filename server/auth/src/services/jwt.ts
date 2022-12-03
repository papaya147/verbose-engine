import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

const generateToken = (id: string) => {
    const payload = {
        userId: id
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

const validateToken = (token: string) => {
    const publicKey = fs.readFileSync(path.join(__dirname, './../../../public.pem'));
    const verifyOptions: VerifyOptions = {
        algorithms: ['RS256']
    };
    return new Promise((resolve, reject) => {
        verify(token, publicKey, verifyOptions, (error, decoded) => {
            if (error)
                return reject(error);
            resolve(decoded);
        });
    });
};

export { generateToken, validateToken };