import express from 'express';
import { InvalidKeyError } from '../errors/invalid-api-key-error';
import { APIKey } from '../models/api-key-model';
import { Hash } from '../services/hash';

const router = express.Router();

router.get('/api/checkkey', async (req, res) => {
    const suppliedKey = req.get('key');
    const suppliedSecret = req.get('secret');

    if (!suppliedKey || !suppliedSecret)
        throw new InvalidKeyError('Key or secret not passed');

    const storedAPIKey = await APIKey.findOne({ key: suppliedKey });

    if (!storedAPIKey)
        throw new InvalidKeyError('Key does not exist');

    if (!Hash.compareKeys(suppliedKey, suppliedSecret, storedAPIKey.salt))
        throw new InvalidKeyError('Key and secret do not correspond')

    res.send('Key and secret are valid');
});

export { router as checkAPIKeyRouter };