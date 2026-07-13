import { AppError } from "./AppError.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(HttpStatusCode.UNAUTHORIZED, message);
  }
}
