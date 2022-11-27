import express, { Request, Response } from 'express';
import { Hash } from '../services/hash';

const router = express.Router();

router.get('/api/createkey', (req, res) => {
    const key = Hash.generatekey();
    const secret = Hash.generateSecretHash(key);
    res.send({ key, secret });
});

export { router as createAPIKeyRouter };