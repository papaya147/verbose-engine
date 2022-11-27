import express, { Request, Response } from 'express';
import { APIKey } from '../services/api-key';

const router = express.Router();

router.get('/api/createkey', (req, res) => {
    const key = APIKey.generatekey();
    const secret = APIKey.generateSecretHash(key);
    res.send({ key, secret });
});

export { router as createAPIKeyRouter };