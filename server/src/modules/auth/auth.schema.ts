import { z } from "zod";

export const registerSchema = {
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
};

export const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email("Invalid email"),
  }),
};

export const resetPasswordSchema = {
  body: z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
};

export const verifyEmailSchema = {
  body: z.object({
    token: z.string().min(1, "Token is required"),
  }),
};

export const changePasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
  }),
};

export const revokeSessionSchema = {
  params: z.object({
    sessionId: z.string().uuid("Invalid session id"),
  }),
};
