import { CookieOptions } from "express";
import { EnvSchema } from "./env.js";

export const buildAppConfig = (env: EnvSchema) => {
  const isProduction = env.NODE_ENV === "production";
  const isTest = env.NODE_ENV === "test";
  const isDevelopment = env.NODE_ENV === "development";

  return {
    env: env.NODE_ENV,
    isProduction,
    isTest,
    isDevelopment,
    port: env.PORT,
    appName: env.APP_NAME,
  };
};

export type AppConfig = ReturnType<typeof buildAppConfig>;
