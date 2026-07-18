import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";
import { AppError } from "../../shared/errors/AppError.js";
import * as auditService from "./Audit.service.js";

interface AuditLogQuery {
  actorId?: string;
  action?: string;
  targetId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page: number;
  limit: number;
}

export const listAuditLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query as unknown as AuditLogQuery;
    const result = await auditService.listAuditLogs(query);
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Audit logs fetched",
      result,
    );
  },
);

export const getAuditLog = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const log = await auditService.getAuditLogById(id);
  if (!log) {
    throw new AppError(HttpStatusCode.NOT_FOUND, "Audit log not found");
  }
  sendSuccess(res, req.requestId, HttpStatusCode.OK, "Audit log fetched", {
    log,
  });
});
