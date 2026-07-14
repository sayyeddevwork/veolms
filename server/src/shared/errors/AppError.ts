// shared/errors/AppError.ts
import { ErrorDetail } from "../response/apiResponse.js";

export class AppError extends Error {
  statusCode: number;
  errors: ErrorDetail[];
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: ErrorDetail[] = [],
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
