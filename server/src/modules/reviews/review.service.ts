import { reviewRepository } from "./review.repository.js";
import { enrollmentService } from "../enrollments/enrollment.service.js";
import { CreateReviewInput, UpdateReviewInput } from "./review.types.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../shared/errors/ConflictError.js";
import { AuthorizationError } from "../../shared/errors/AuthorizationError.js";

export const reviewService = {
  create: async (
    userId: string,
    courseId: string,
    input: CreateReviewInput,
  ) => {
    const isEnrolled = await enrollmentService.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new AuthorizationError(
        "You must be enrolled in this course to leave a review",
      );
    }

    const existing = await reviewRepository.findByUserAndCourse(
      userId,
      courseId,
    );
    if (existing) {
      throw new ConflictError(
        "You have already reviewed this course. You can edit your existing review instead.",
      );
    }

    return reviewRepository.create(userId, courseId, input);
  },

  listByCourse: async (courseId: string) => {
    const [reviews, summary] = await Promise.all([
      reviewRepository.findByCourse(courseId),
      reviewRepository.getCourseRatingSummary(courseId),
    ]);

    return {
      ...summary,
      reviews: reviews.map((r) => ({
        id: r.id,
        userName: r.user.name,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
    };
  },

  update: async (
    reviewId: string,
    userId: string,
    input: UpdateReviewInput,
  ) => {
    const review = await reviewRepository.findById(reviewId);
    if (!review) throw new NotFoundError("Review not found");
    if (review.userId !== userId) {
      throw new AuthorizationError("You can only edit your own reviews");
    }
    return reviewRepository.update(reviewId, input);
  },

  delete: async (reviewId: string, userId: string, isAdmin: boolean) => {
    const review = await reviewRepository.findById(reviewId);
    if (!review) throw new NotFoundError("Review not found");
    if (review.userId !== userId && !isAdmin) {
      throw new AuthorizationError("You can only delete your own reviews");
    }
    await reviewRepository.delete(reviewId);
  },
};
