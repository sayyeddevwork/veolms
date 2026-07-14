import { Request, Response, NextFunction } from "express";
import { Prisma } from "../infrastructure/database/prisma.client.js";
import { AppError } from "../shared/errors/AppError.js";
import { HttpStatusCode } from "../constants/httpStatusCodes.js";
import { Messages } from "../constants/messages.js";
import { sendError } from "../shared/response/apiResponse.js";
import { logError } from "../infrastructure/logging/index.js";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Known, operational errors — safe to expose message/errors to client
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logError(err, { requestId: req.id, path: req.originalUrl });
    }
    return sendError(
      res,
      req.requestId,
      err.statusCode,
      err.message,
      err.errors,
    );
  }

  // Prisma: unique constraint violation (e.g. duplicate enrollment, duplicate email)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target =
        (err.meta?.target as string[] | undefined)?.join(", ") ?? "field";
      return sendError(
        res,
        req.requestId,
        HttpStatusCode.CONFLICT,
        `A record with this ${target} already exists`,
      );
    }
    if (err.code === "P2025") {
      return sendError(
        res,
        req.requestId,
        HttpStatusCode.NOT_FOUND,
        "Record not found",
      );
    }
  }

  // Zod validation errors that slip through without being wrapped
  if (err instanceof Error && err.name === "ZodError") {
    return sendError(
      res,
      req.requestId,
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      Messages.VALIDATION_FAILED,
      (err as any).errors,
    );
  }

  // Unknown/unexpected errors — never leak internals to the client
  logError(err, { requestId: req.id, path: req.originalUrl });
  return sendError(
    res,
    req.requestId,
    HttpStatusCode.INTERNAL_SERVER_ERROR,
    Messages.INTERNAL_SERVER_ERROR,
  );
};
