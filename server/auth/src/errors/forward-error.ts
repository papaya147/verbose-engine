import { CustomError } from "./custom-error";

export class ForwardError extends CustomError {
    constructor(public statusCode: number, public errors: { message: string, field?: string }[]) {
        super('Error forwarding from sub-request');
        Object.setPrototypeOf(this, ForwardError.prototype);
    }

    serialiseErrors() {
        return this.errors
    }
}