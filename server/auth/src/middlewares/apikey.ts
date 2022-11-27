import axios from 'axios';
import { ForwardError } from '../errors/forward-error';

export class APIKey {
    static async checkKey(key: string | undefined, secret: string | undefined) {
        const res = await axios.get('http://localhost:4000/api/checkkey', {
            headers: {
                'key': key,
                'secret': secret
            }
        }).catch(err => {
            if (err.response)
                throw new ForwardError(err.response.status, err.response.data.errors);
        });
        return res;
    }
}