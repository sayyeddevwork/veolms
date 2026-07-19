import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { courseService } from "./course.service.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";
import { enrollmentService } from "../enrollments/enrollment.service.js";

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await courseService.create(req.body, req.user!, req.ip);
    res.location(`/api/v1/courses/${course.id}`);
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.CREATED,
      "Course created successfully",
      { course },
    );
  },
);

export const listCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await courseService.listPublished();
  sendSuccess(res, req.requestId, HttpStatusCode.OK, "Courses fetched", {
    courses,
  });
});

export const listCoursesAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const courses = await courseService.listAllForAdmin();
    sendSuccess(res, req.requestId, HttpStatusCode.OK, "All courses fetched", {
      courses,
    });
  },
);

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
  const courseId = req.params.id as string;
  const isEnrolled = req.user
    ? await enrollmentService.isEnrolled(req.user.id, courseId)
    : false;
  const course = await courseService.getById(courseId, isEnrolled);
  sendSuccess(res, req.requestId, HttpStatusCode.OK, "Course fetched", {
    course,
  });
});

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await courseService.update(
      req.params.id as string,
      req.body,
      req.user!,
      req.ip,
    );
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Course updated successfully",
      {
        course,
      },
    );
  },
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    await courseService.delete(req.params.id as string, req.user!, req.ip);
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Course deleted successfully",
    );
  },
);
