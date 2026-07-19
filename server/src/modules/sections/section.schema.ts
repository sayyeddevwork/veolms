import { z } from "zod";

export const createSectionSchema = {
  body: z.object({
    title: z.string().min(2, "Title must be at least 2 characters").max(200),
    order: z.number().int().nonnegative(),
  }),
  params: z.object({
    courseId: z.string().min(1),
  }),
};

export const updateSectionSchema = {
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    order: z.number().int().nonnegative().optional(),
  }),
  params: z.object({
    courseId: z.string().min(1),
    sectionId: z.string().min(1),
  }),
};

export const sectionParamSchema = {
  params: z.object({
    courseId: z.string().min(1),
    sectionId: z.string().min(1),
  }),
};
