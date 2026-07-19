import { Router } from "express";
import {
  createLesson,
  updateLesson,
  deleteLesson,
} from "./lesson.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createLessonSchema,
  updateLessonSchema,
  lessonParamSchema,
} from "./lesson.schema.js";
import { UserRole } from "../../shared/types/roles.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR),
  validate(createLessonSchema),
  createLesson,
);
router.patch(
  "/:lessonId",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR),
  validate(updateLessonSchema),
  updateLesson,
);
router.delete(
  "/:lessonId",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR),
  validate(lessonParamSchema),
  deleteLesson,
);

export default router;
