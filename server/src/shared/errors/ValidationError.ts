import { AppError } from "./AppError.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export class ValidationError extends AppError {
  constructor(message = "Validation failed", errors: unknown[] = []) {
    super(HttpStatusCode.UNPROCESSABLE_ENTITY, message, errors);
  }
}
