import { CustomError } from "./custom-error";

export class InvalidKeyError extends CustomError {
    statusCode: number = 404;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidKeyError.prototype);
    }

    serialiseErrors() {
        return [{ message: this.message }];
    }
}