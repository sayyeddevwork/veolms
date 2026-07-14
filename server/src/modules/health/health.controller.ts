import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { healthService } from "./health.service.js";
import { sendSuccess, sendError } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";
import { Messages } from "../../constants/messages.js";
import { register } from "../../infrastructure/monitoring/metrics.js";

export const getLiveness = asyncHandler(async (req: Request, res: Response) => {
  const liveness = healthService.getLiveness();
  sendSuccess(
    res,
    req.requestId,
    HttpStatusCode.OK,
    Messages.SERVER_HEALTHY ?? "Server is healthy",
    liveness,
  );
});

export const getReadiness = asyncHandler(
  async (req: Request, res: Response) => {
    const { isHealthy, checks, memory, uptimeSeconds } =
      await healthService.getReadiness();

    const payload = { checks, memory, uptimeSeconds };

    if (isHealthy) {
      sendSuccess(
        res,
        req.requestId,
        HttpStatusCode.OK,
        "Service ready",
        payload,
      );
    } else {
      sendError(
        res,
        req.requestId,
        HttpStatusCode.SERVICE_UNAVAILABLE,
        "Service not ready",
        [],
        payload,
      );
    }
  },
);

export const getMetrics = asyncHandler(async (req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
