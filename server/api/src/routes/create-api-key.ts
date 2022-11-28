import express, { Request, Response } from 'express';
import { APIKey } from '../models/api-key-model';
import { Hash } from '../services/hash';

const router = express.Router();

router.get('/api/createkey', async (req, res) => {
    const key = Hash.generatekey();
    const [secret, salt] = Hash.generateSecretHash(key).split('.');

    await APIKey.build({ secret, salt }).save();

    res.send({ key, secret });
});

export { router as createAPIKeyRouter };