import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  APP_NAME: z.string().default("VeoLMS"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  LOG_PRETTY: z
    .enum(["true", "false"])
    .default("true")
    .transform((val) => val === "true"),
  CLIENT_URL: z.string().url({ message: "CLIENT_URL must be a valid URL" }),
  SLOW_QUERY_THRESHOLD_MS: z.coerce.number().int().positive().default(200),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  REFRESH_TOKEN_EXPIRY_DAYS: z.coerce.number().int().positive().default(30),
  EMAIL_VERIFICATION_EXPIRY_HOURS: z.coerce
    .number()
    .int()
    .positive()
    .default(24),
  PASSWORD_RESET_EXPIRY_MINUTES: z.coerce.number().int().positive().default(60),

  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
  SMTP_FROM: z.string().min(1, "SMTP_FROM is required"),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_URL: z.string().url(), // your bucket's public access URL or custom domain
});

export type EnvSchema = z.infer<typeof envSchema>;
export { envSchema };
