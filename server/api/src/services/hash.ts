import { randomBytes, scryptSync } from 'crypto';

export class Hash {
    static generatekey(size: number = 16) {
        const buffer = randomBytes(size);
        return `${buffer.toString('hex')}`
    }

    static generateSecretHash(key: string) {
        const salt = randomBytes(8).toString('hex');
        const buffer = scryptSync(key, salt, 32) as Buffer;
        return `${buffer.toString('hex')}.${salt}`;
    }

    static compareKeys(suppliedKey: string, hashedPassword: string, salt: string) {
        const buffer = scryptSync(suppliedKey, salt, 32) as Buffer;
        return buffer.toString('hex') === hashedPassword;
    }
}