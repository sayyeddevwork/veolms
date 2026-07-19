import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { progressService } from "./progress.service.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export const updateProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const progress = await progressService.updateProgress(
      req.user!.id,
      req.params.lessonId as string,
      req.body,
    );
    sendSuccess(res, req.requestId, HttpStatusCode.OK, "Progress updated", {
      progress,
    });
  },
);

export const getCourseProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const progress = await progressService.getCourseProgress(
      req.user!.id,
      req.params.courseId as string,
    );
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Course progress fetched",
      {
        progress,
      },
    );
  },
);

export const getContinueLearning = asyncHandler(
  async (req: Request, res: Response) => {
    const items = await progressService.getContinueLearning(req.user!.id);
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Continue learning fetched",
      {
        items,
      },
    );
  },
);
