// shared/errors/ValidationError.ts
import { AppError } from "./AppError.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";
import { ErrorDetail } from "../response/apiResponse.js";

export class ValidationError extends AppError {
  constructor(errors: ErrorDetail[], message = "Validation failed") {
    super(HttpStatusCode.UNPROCESSABLE_ENTITY, message, errors);
  }
}
