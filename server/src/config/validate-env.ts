import { envSchema, EnvSchema } from "./env.js";

export const validateEnv = (): EnvSchema => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:\n");

    const flattened = parsed.error.flatten().fieldErrors;
    for (const [key, messages] of Object.entries(flattened)) {
      console.error(`  ${key}: ${messages?.join(", ")}`);
    }

    console.error("\nFix the .env file and restart the server.");
    process.exit(1);
  }

  return parsed.data;
};
