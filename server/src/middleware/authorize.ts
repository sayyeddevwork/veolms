import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../shared/errors/AuthorizationError.js";
import { UserRole } from "../shared/types/roles.js";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError());
    }
    next();
  };
};
