import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../shared/errors/AuthorizationError.js";

export const authorize = (...allowedRoles: Array<"STUDENT" | "ADMIN">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError());
    }
    next();
  };
};
