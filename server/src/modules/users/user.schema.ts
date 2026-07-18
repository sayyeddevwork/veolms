import { z } from "zod";
import { UserRole } from "../../shared/types/roles.js";

export const changeRoleSchema = {
  body: z.object({
    role: z.enum([UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN]),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
};

export const updateProfileSchema = {
  body: z.object({
    name: z.string().min(2).max(100).optional(),
  }),
};

export const userIdParamSchema = {
  params: z.object({
    id: z.string().min(1),
  }),
};
