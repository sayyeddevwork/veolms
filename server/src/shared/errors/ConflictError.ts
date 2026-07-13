import { AppError } from "./AppError.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(HttpStatusCode.CONFLICT, message);
  }
}
