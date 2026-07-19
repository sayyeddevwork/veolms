import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { sectionService } from "./section.service.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export const createSection = asyncHandler(
  async (req: Request, res: Response) => {
    const section = await sectionService.create(
      req.params.courseId as string,
      req.body,
      req.user!.id,
      req.user!.role,
      req.ip,
    );
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.CREATED,
      "Section created successfully",
      { section },
    );
  },
);

export const listSections = asyncHandler(
  async (req: Request, res: Response) => {
    const sections = await sectionService.listByCourse(
      req.params.courseId as string,
    );
    sendSuccess(res, req.requestId, HttpStatusCode.OK, "Sections fetched", {
      sections,
    });
  },
);

export const updateSection = asyncHandler(
  async (req: Request, res: Response) => {
    const section = await sectionService.update(
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
      HttpStatusCode.OK,
      "Section updated successfully",
      { section },
    );
  },
);

export const deleteSection = asyncHandler(
  async (req: Request, res: Response) => {
    await sectionService.delete(
      req.params.courseId as string,
      req.params.sectionId as string,
      req.user!.id,
      req.user!.role,
      req.ip,
    );
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Section deleted successfully",
    );
  },
);
