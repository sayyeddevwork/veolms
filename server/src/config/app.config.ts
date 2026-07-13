import { EnvSchema } from "./env.js";

export const buildAppConfig = (env: EnvSchema) => {
  const isProduction = env.NODE_ENV === "production";
  const isTest = env.NODE_ENV === "test";
  const isDevelopment = env.NODE_ENV === "development";
  const corsOrigins = env.CLIENT_URL.split(",");
  return {
    env: env.NODE_ENV,
    isProduction,
    isTest,
    isDevelopment,
    port: env.PORT,
    appName: env.APP_NAME,
    logLevel: env.LOG_LEVEL,
    logPretty: env.LOG_PRETTY,
    corsOrigins,
    slowQueryThresholdMs: env.SLOW_QUERY_THRESHOLD_MS,
  };
};

export type AppConfig = ReturnType<typeof buildAppConfig>;
