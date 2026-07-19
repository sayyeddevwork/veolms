import { z } from "zod";

export const notificationIdParamSchema = {
  params: z.object({
    id: z.string().min(1),
  }),
};
