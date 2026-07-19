import { z } from "zod";

export const instructorIdParamSchema = {
  params: z.object({
    instructorId: z.string().min(1),
  }),
};
