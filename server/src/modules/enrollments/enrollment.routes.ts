import { Router } from "express";
import {
  enrollFree,
  getMyEnrollments,
  getCourseEnrollments,
} from "./enrollment.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { courseIdParamSchema } from "./enrollment.schema.js";
import { UserRole } from "../../shared/types/roles.js";

const router = Router();

router.post(
  "/courses/:courseId/enroll",
  authenticate,
  validate(courseIdParamSchema),
  enrollFree,
);
router.get("/me", authenticate, getMyEnrollments);
router.get(
  "/courses/:courseId",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR),
  validate(courseIdParamSchema),
  getCourseEnrollments,
);

export default router;
