import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../shared/helpers/jwt.helper.js";
import { AuthenticationError } from "../shared/errors/AuthenticationError.js";
declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
    }
  }
}

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
    req.sessionId = payload.sessionId;
    next();
  } catch {
    next(new AuthenticationError("Invalid or expired session"));
  }
};
function extractBearerToken(req: Request): string | null {
  const header = req.header("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Missing access token" });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    req.sessionId = payload.sessionId;
    next();
  } catch {
    // Covers both expired and malformed tokens — client should call /refresh and retry
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
}
