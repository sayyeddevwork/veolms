import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { reviewService } from "./review.service.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";
import { UserRole } from "../../shared/types/roles.js";

export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const review = await reviewService.create(
      req.user!.id,
      req.params.courseId as string,
      req.body,
    );
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.CREATED,
      "Review submitted successfully",
      { review },
    );
  },
);

export const listReviews = asyncHandler(async (req: Request, res: Response) => {
  const result = await reviewService.listByCourse(
    req.params.courseId as string,
  );
  sendSuccess(res, req.requestId, HttpStatusCode.OK, "Reviews fetched", result);
});

export const updateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const review = await reviewService.update(
      req.params.reviewId as string,
      req.user!.id,
      req.body,
    );
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Review updated successfully",
      { review },
    );
  },
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const isAdmin = req.user!.role === UserRole.ADMIN;
    await reviewService.delete(
      req.params.reviewId as string,
      req.user!.id,
      isAdmin,
    );
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Review deleted successfully",
    );
  },
);
