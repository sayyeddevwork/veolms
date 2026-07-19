import { Router } from "express";
import {
  getInstructorAnalytics,
  getAdminAnalytics,
} from "./analytics.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { UserRole } from "../../shared/types/roles.js";
import { getInstructorAnalyticsById } from "./analytics.controller.js";
import { instructorIdParamSchema } from "./analytics.schema.js";
import { validate } from "../../middleware/validate.js";

const router = Router();

router.get(
  "/instructor",
  authenticate,
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN),
  getInstructorAnalytics,
);
router.get(
  "/admin",
  authenticate,
  authorize(UserRole.ADMIN),
  getAdminAnalytics,
);
router.get(
  "/instructor/:instructorId",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(instructorIdParamSchema),
  getInstructorAnalyticsById,
);

export default router;
