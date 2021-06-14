import { CustomError } from "../errors/custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = "Error connecting to database";
    constructor() {
        super("Error connecting to db");

        // Only because we are extending built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}
