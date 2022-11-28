// modules
import express, { Request, Response } from 'express';

// models
import { APIKey } from '../models/api-key-model';

// services
import { Hash } from '../services/hash';

const router = express.Router();

router.get('/api/createkey', async (req, res) => {
    const key = Hash.generatekey();
    const [secret, salt] = Hash.generateSecretHash(key).split('.');

    // API keys last 1 day
    await APIKey.build({ secret, salt }).save();

    res.send({ key, secret });
});

export { router as createAPIKeyRouter };