import { Request, Response } from "express";
import { HttpStatusCode } from "../constants/httpStatusCodes.js";
import { sendError } from "../shared/response/apiResponse.js";

export const notFoundHandler = (req: Request, res: Response) => {
  sendError(
    res,
    req.requestId,
    HttpStatusCode.NOT_FOUND,
    `Route ${req.method} ${req.originalUrl} not found`,
  );
};
