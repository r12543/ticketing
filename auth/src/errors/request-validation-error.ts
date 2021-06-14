import { ValidationError } from "express-validator";
import { CustomError } from "../errors/custom-error";

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super("Invalid request parameters"); // just for logging purposes

        // Only because we are extending built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map((error) => {
            return {
                message: error.msg,
                field: error.param,
            };
        });
    }
}
