import { z } from "zod";

export const createLessonSchema = {
  body: z.object({
    title: z.string().min(2, "Title must be at least 2 characters").max(200),
    videoRef: z.string().min(1, "Video reference is required"),
    duration: z.number().int().nonnegative().optional(),
    isPreview: z.boolean().optional(),
    order: z.number().int().nonnegative(),
  }),
  params: z.object({
    courseId: z.string().min(1),
    sectionId: z.string().min(1),
  }),
};

export const updateLessonSchema = {
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    videoRef: z.string().min(1).optional(),
    duration: z.number().int().nonnegative().optional(),
    isPreview: z.boolean().optional(),
    order: z.number().int().nonnegative().optional(),
  }),
  params: z.object({
    courseId: z.string().min(1),
    sectionId: z.string().min(1),
    lessonId: z.string().min(1),
  }),
};

export const lessonParamSchema = {
  params: z.object({
    courseId: z.string().min(1),
    sectionId: z.string().min(1),
    lessonId: z.string().min(1),
  }),
};
