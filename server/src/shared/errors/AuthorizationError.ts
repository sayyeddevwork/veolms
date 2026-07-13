import { AppError } from "./AppError.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(HttpStatusCode.FORBIDDEN, message);
  }
}
