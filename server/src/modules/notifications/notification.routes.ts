import { Router } from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from "./notification.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { notificationIdParamSchema } from "./notification.schema.js";

const router = Router();

router.get("/", authenticate, getMyNotifications);
router.patch(
  "/:id/read",
  authenticate,
  validate(notificationIdParamSchema),
  markAsRead,
);
router.patch("/read-all", authenticate, markAllAsRead);

export default router;
