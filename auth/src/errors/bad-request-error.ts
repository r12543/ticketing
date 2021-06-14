import { CustomError } from "../errors/custom-error";

export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(public message: string) {
        super(message); // just for logging purposes

        // Only because we are extending built in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
