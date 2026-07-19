import rateLimit from "express-rate-limit";
import { config } from "../config/index.js";
import { HttpStatusCode } from "../constants/httpStatusCodes.js";
import { logSecurityEvent } from "../infrastructure/logging/index.js";

// Stricter limiter specifically for auth endpoints — brute-force/credential-stuffing protection
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again in 15 minutes.",
    errors: [],
  },
  handler: (req, res, next, options) => {
    logSecurityEvent({
      event: "rate_limit_exceeded",
      ip: req.ip ?? "unknown",
      route: req.originalUrl,
    });
    res.status(HttpStatusCode.TOO_MANY_REQUESTS ?? 429).json(options.message);
  },
});

// General-purpose limiter for the rest of the API — more permissive
export const generalRateLimiter = rateLimit({
  windowMs: config.app.rateLimit.windowMs,
  max: config.app.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
    errors: [],
  },
});
