import { Router } from "express";
import {
  createSection,
  listSections,
  updateSection,
  deleteSection,
} from "./section.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createSectionSchema,
  updateSectionSchema,
  sectionParamSchema,
} from "./section.schema.js";
import { UserRole } from "../../shared/types/roles.js";

const router = Router({ mergeParams: true });

router.get("/", listSections);
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR),
  validate(createSectionSchema),
  createSection,
);
router.patch(
  "/:sectionId",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR),
  validate(updateSectionSchema),
  updateSection,
);
router.delete(
  "/:sectionId",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR),
  validate(sectionParamSchema),
  deleteSection,
);

export default router;
