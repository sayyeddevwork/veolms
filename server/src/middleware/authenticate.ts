import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../shared/helpers/jwt.helper.js";
import { AuthenticationError } from "../shared/errors/AuthenticationError.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(new AuthenticationError("Authentication required"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch {
    next(new AuthenticationError("Invalid or expired session"));
  }
};
