import { Router } from "express";
import {
  createCourse,
  listCourses,
  listCoursesAdmin,
  getCourse,
  updateCourse,
  deleteCourse,
} from "./course.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createCourseSchema,
  updateCourseSchema,
  courseIdParamSchema,
} from "./course.schema.js";
import { UserRole } from "../../shared/types/roles.js";

const router = Router();

// Public routes — no auth required
router.get("/", listCourses);
router.get("/:id", validate(courseIdParamSchema), getCourse);

// Admin-only routes
router.post(
  "/",
  authenticate,
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN),
  validate(createCourseSchema),
  createCourse,
);
router.get(
  "/admin/all",
  authenticate,
  authorize(UserRole.ADMIN),
  listCoursesAdmin,
);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN),
  validate(updateCourseSchema),
  updateCourse,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.INSTRUCTOR, UserRole.ADMIN),
  validate(courseIdParamSchema),
  deleteCourse,
);

export default router;
