import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { enrollmentService } from "./enrollment.service.js";
import { courseRepository } from "../courses/course.repository.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";
import { AuthorizationError } from "../../shared/errors/AuthorizationError.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { UserRole } from "../../shared/types/roles.js";

export const enrollFree = asyncHandler(async (req: Request, res: Response) => {
  const enrollment = await enrollmentService.enrollFree(
    req.user!.id,
    req.params.courseId as string,
    req.ip,
  );
  sendSuccess(
    res,
    req.requestId,
    HttpStatusCode.CREATED,
    "Enrolled successfully",
    { enrollment },
  );
});

export const getMyEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollments = await enrollmentService.listMyEnrollments(req.user!.id);
    sendSuccess(res, req.requestId, HttpStatusCode.OK, "Enrollments fetched", {
      enrollments,
    });
  },
);

export const getCourseEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;

    // Instructors may only view enrollments for courses they own; Admin bypasses this.
    if (req.user!.role !== UserRole.ADMIN) {
      const ownerId = await courseRepository.findOwnerId(courseId);
      if (!ownerId) throw new NotFoundError("Course not found");
      if (ownerId !== req.user!.id) {
        throw new AuthorizationError(
          "You can only view enrollments for your own courses",
        );
      }
    }

    const enrollments = await enrollmentService.listCourseEnrollments(courseId);
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Course enrollments fetched",
      { enrollments },
    );
  },
);
