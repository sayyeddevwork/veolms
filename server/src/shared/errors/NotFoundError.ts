import { AppError } from "./AppError.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(HttpStatusCode.NOT_FOUND, message);
  }
}
