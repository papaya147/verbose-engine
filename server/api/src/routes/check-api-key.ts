import express from 'express';
import { InvalidKeyError } from '../errors/invalid-api-key-error';
import { APIKey } from '../models/api-key-model';
import { Hash } from '../services/hash';

const router = express.Router();

router.post('/api/checkkey', async (req, res) => {
    const { key: suppliedKey, secret: suppliedSecret } = req.body;

    if (!suppliedKey || !suppliedSecret)
        throw new InvalidKeyError('Key or secret not passed');

    const storedAPI = await APIKey.findOne({ secret: suppliedSecret });

    if (!storedAPI)
        throw new InvalidKeyError('Secret does not exist');

    if (!Hash.compareKeys(suppliedKey, suppliedSecret, storedAPI.salt))
        throw new InvalidKeyError('Key and secret do not correspond')

    res.send({ message: 'Key and secret are valid', valid: true });
});

export { router as checkAPIKeyRouter };