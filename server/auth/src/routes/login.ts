import express from 'express';
import { getToken, validateToken } from '../services/jwt';

const router = express.Router();

router.get('/', (req, res) => {
    let token = getToken(req);
    const decoded = validateToken(token);
    if (decoded.userId !== undefined)
        res.status(200).send({ token, message: 'logged in' });
    res.status(200).send({ message: 'not logged in' });
});

export { router as loginRouter };