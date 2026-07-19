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
import sectionRoutes from "../sections/section.routes.js"; // ← add this

const router = Router();

router.get("/", listCourses);
router.get("/:id", validate(courseIdParamSchema), getCourse);

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

router.use("/:courseId/sections", sectionRoutes); // ← add this

export default router;
