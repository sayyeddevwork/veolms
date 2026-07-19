import { Router } from "express";
import {
  updateProgress,
  getCourseProgress,
  getContinueLearning,
} from "./progress.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import {
  updateProgressSchema,
  courseIdParamSchema,
} from "./progress.schema.js";

const router = Router();

router.patch(
  "/lessons/:lessonId",
  authenticate,
  validate(updateProgressSchema),
  updateProgress,
);
router.get(
  "/courses/:courseId",
  authenticate,
  validate(courseIdParamSchema),
  getCourseProgress,
);
router.get("/continue-learning", authenticate, getContinueLearning);

export default router;
