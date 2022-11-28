import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode: number = 404;

    constructor() {
        super('Page does not exist');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serialiseErrors() {
        return [{ message: 'Page does not exist' }];
    }
}