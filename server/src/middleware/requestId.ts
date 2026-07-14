// middleware/requestId.ts
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.requestId = req.headers["x-request-id"]?.toString() ?? randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
};
