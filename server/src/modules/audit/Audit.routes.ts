import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { listAuditLogsSchema, getAuditLogSchema } from "./Audit.schema .js";
import * as auditController from "./Audit.controller.js";
import { UserRole } from "../../shared/types/roles.js";

const router = Router();

// Every route in this file requires an authenticated admin
router.use(authenticate, authorize(UserRole.ADMIN));

router.get("/", validate(listAuditLogsSchema), auditController.listAuditLogs);
router.get("/:id", validate(getAuditLogSchema), auditController.getAuditLog);

export default router;
