import { randomBytes, scryptSync } from 'crypto';

export class APIKey {
    static generatekey(size: number = 16) {
        const buffer = randomBytes(size);
        return `${buffer.toString('hex')}`
    }

    static generateSecretHash(key: string) {
        const salt = randomBytes(8).toString('hex');
        const buffer = scryptSync(key, salt, 32) as Buffer;
        return `${buffer.toString('hex')}.${salt}`;
    }

    static compareKeys(suppliedKey: string, storedKey: string) {
        const [hashedPassword, salt] = storedKey.split('.');
        const buffer = scryptSync(suppliedKey, salt, 32) as Buffer;
        return buffer.toString('hex') === suppliedKey;
    }
}