import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  getSessions,
  deleteSession,
} from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { registerSchema, loginSchema } from "./auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.get("/sessions", authenticate, getSessions);
router.delete("/sessions/:sessionId", authenticate, deleteSession);

export default router;
