import { CustomError } from "./custom-error";

export class DatabaseError extends CustomError {
    statusCode: number = 404;

    constructor() {
        super('database down');
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }

    serialiseErrors() {
        return [{ message: 'database down' }];
    }
}