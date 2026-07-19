import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  getSessions,
  deleteSession,
  resendVerification,
  verifyEmail,
  refresh,
} from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { authRateLimiter } from "../../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.get("/sessions", authenticate, getSessions);
router.get("/verify-email", verifyEmail);
router.delete("/sessions/:sessionId", authenticate, deleteSession);
router.post("/refresh", authRateLimiter, refresh);
// auth.routes.ts
router.post("/resend-verification", authenticate, resendVerification);

export default router;
