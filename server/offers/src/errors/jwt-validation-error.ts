import { CustomError } from "./custom-error";

export class JwtValidationError extends CustomError {
    statusCode = 401;

    constructor(public field: string, public message: string = 'missing property in token') {
        super(message);
        Object.setPrototypeOf(this, JwtValidationError.prototype);
    }

    serialiseErrors() {
        return [{ message: this.message, field: this.field }];
    }
}