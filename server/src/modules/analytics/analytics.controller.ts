import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { analyticsService } from "./analytics.service.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export const getInstructorAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const overview = await analyticsService.getInstructorOverview(req.user!.id);
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Instructor analytics fetched",
      overview,
    );
  },
);

export const getAdminAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const overview = await analyticsService.getAdminOverview();
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Platform analytics fetched",
      overview,
    );
  },
);
