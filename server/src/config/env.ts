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
});

export type EnvSchema = z.infer<typeof envSchema>;
export { envSchema };
