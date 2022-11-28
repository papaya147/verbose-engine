import axios from 'axios';
import { ForwardError } from '../errors/forward-error';

export class APIKey {
    static async checkKey(key: string | undefined, secret: string | undefined) {
        const data = {
            key,
            secret
        }

        const res = await axios.post('http://localhost:4000/api/checkkey', data).catch(err => {
            if (err.response)
                throw new ForwardError(err.response.status, err.response.data.errors);
        });
        return res;
    }
}