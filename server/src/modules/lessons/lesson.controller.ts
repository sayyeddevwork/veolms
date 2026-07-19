import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { lessonService } from "./lesson.service.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export const createLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const lesson = await lessonService.create(
      req.params.courseId as string,
      req.params.sectionId as string,
      req.body,
      req.user!.id,
      req.user!.role,
      req.ip,
    );
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.CREATED,
      "Lesson created successfully",
      { lesson },
    );
  },
);

export const updateLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const lesson = await lessonService.update(
      req.params.courseId as string,
      req.params.sectionId as string,
      req.params.lessonId as string,
      req.body,
      req.user!.id,
      req.user!.role,
      req.ip,
    );
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Lesson updated successfully",
      {
        lesson,
      },
    );
  },
);

export const deleteLesson = asyncHandler(
  async (req: Request, res: Response) => {
    await lessonService.delete(
      req.params.courseId as string,
      req.params.sectionId as string,
      req.params.lessonId as string,
      req.user!.id,
      req.user!.role,
      req.ip,
    );
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Lesson deleted successfully",
    );
  },
);
