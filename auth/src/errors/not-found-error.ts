import { CustomError } from "../errors/custom-error";

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor() {
        super("Route not found");

        // Only because we are extending built in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: "Not Found" }];
    }
}
