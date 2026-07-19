// middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../shared/errors/ValidationError.js";
import { ErrorDetail } from "../shared/response/apiResponse.js";

type RequestPart = "body" | "query" | "params";

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

const zodIssuesToErrorDetails = (error: ZodError): ErrorDetail[] =>
  error.issues.map((issue) => ({
    field: issue.path.join(".") || undefined,
    message: issue.message,
  }));

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parts: RequestPart[] = ["body", "query", "params"];
    const allErrors: ErrorDetail[] = [];

    for (const part of parts) {
      const schema = schemas[part];
      if (!schema) continue;

      const result = schema.safeParse(req[part]);
      if (!result.success) {
        allErrors.push(...zodIssuesToErrorDetails(result.error));
      } else if (part === "query") {
        Object.defineProperty(req, "query", {
          value: result.data,
          writable: true,
          configurable: true,
        });
      } else {
        // Assign parsed/coerced data back (e.g. query string "5" -> number 5)
        req[part] = result.data;
      }
    }

    if (allErrors.length > 0) {
      return next(new ValidationError(allErrors));
    }

    next();
  };
};
