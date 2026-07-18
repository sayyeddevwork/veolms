import { z } from "zod";

export const createCourseSchema = {
  body: z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10),
    thumbnail: z.string().url(),
    price: z.number().int().nonnegative(),
  }),
};

export const updateCourseSchema = {
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).optional(),
    thumbnail: z.string().url().optional(),
    price: z.number().int().nonnegative().optional(),
    published: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
};

export const courseIdParamSchema = {
  params: z.object({
    id: z.string().min(1),
  }),
};
