import { CustomError } from "./custom-error";

export class JwtValidationError extends CustomError {
    statusCode = 401;

    constructor(public message: string, public field: string) {
        super(message);
        Object.setPrototypeOf(this, JwtValidationError.prototype);
    }

    serialiseErrors() {
        return [{ message: this.message, field: this.field }];
    }
}