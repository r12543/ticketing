import { CustomError } from "../errors/custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super("Not Authorized"); // just for logging purposes

        // Only because we are extending built in class
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors() {
        return [{ message: "Not Authorized" }];
    }
}
