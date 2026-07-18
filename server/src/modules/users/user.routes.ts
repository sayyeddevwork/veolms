import { Router } from "express";
import {
  getMe,
  updateMe,
  listUsers,
  getUserById,
  changeUserRole,
} from "./user.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
  changeRoleSchema,
  updateProfileSchema,
  userIdParamSchema,
} from "./user.schema.js";
import { UserRole } from "../../shared/types/roles.js";

const router = Router();

router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, validate(updateProfileSchema), updateMe);

router.get("/", authenticate, authorize(UserRole.ADMIN), listUsers);
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(userIdParamSchema),
  getUserById,
);
router.patch(
  "/:id/role",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(changeRoleSchema),
  changeUserRole,
);

export default router;
