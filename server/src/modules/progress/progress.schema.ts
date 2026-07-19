import { z } from "zod";

export const updateProgressSchema = {
  body: z.object({
    watchedSeconds: z.number().int().nonnegative(),
    completed: z.boolean().optional(),
  }),
  params: z.object({
    lessonId: z.string().min(1),
  }),
};

export const courseIdParamSchema = {
  params: z.object({
    courseId: z.string().min(1),
  }),
};
