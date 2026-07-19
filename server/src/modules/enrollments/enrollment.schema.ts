import { z } from "zod";

export const courseIdParamSchema = {
  params: z.object({
    courseId: z.string().min(1),
  }),
};
