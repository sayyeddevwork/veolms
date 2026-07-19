import { z } from "zod";

export const createReviewSchema = {
  body: z.object({
    rating: z
      .number()
      .int()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5"),
    comment: z
      .string()
      .max(1000, "Comment must be under 1000 characters")
      .optional(),
  }),
  params: z.object({
    courseId: z.string().min(1),
  }),
};

export const updateReviewSchema = {
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().max(1000).optional(),
  }),
  params: z.object({
    courseId: z.string().min(1),
    reviewId: z.string().min(1),
  }),
};

export const reviewParamSchema = {
  params: z.object({
    courseId: z.string().min(1),
    reviewId: z.string().min(1),
  }),
};

export const courseIdParamSchema = {
  params: z.object({
    courseId: z.string().min(1),
  }),
};
