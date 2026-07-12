import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  APP_NAME: z.string().default("VeoLMS"),
});

export type EnvSchema = z.infer<typeof envSchema>;
export { envSchema };
