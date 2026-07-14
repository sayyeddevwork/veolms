import e, { CookieOptions } from "express";
import { EnvSchema } from "./env.js";
export const buildAppConfig = (env: EnvSchema) => {
  const isProduction = env.NODE_ENV === "production";
  const isTest = env.NODE_ENV === "test";
  const isDevelopment = env.NODE_ENV === "development";
  const corsOrigins = env.CLIENT_URL.split(",");

  const accessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  };

  const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/v1/auth/refresh",
  };

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
    cookies: {
      accessToken: accessTokenCookieOptions,
      refreshToken: refreshTokenCookieOptions,
    },
    slowQueryThresholdMs: env.SLOW_QUERY_THRESHOLD_MS,
    JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN: env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: env.JWT_REFRESH_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRY_DAYS: env.REFRESH_TOKEN_EXPIRY_DAYS,
    EMAIL_VERIFICATION_EXPIRY_HOURS: env.EMAIL_VERIFICATION_EXPIRY_HOURS,
    PASSWORD_RESET_EXPIRY_MINUTES: env.PASSWORD_RESET_EXPIRY_MINUTES,
    smtp: {
      HOST: env.SMTP_HOST,
      PORT: env.SMTP_PORT,
      USER: env.SMTP_USER,
      PASS: env.SMTP_PASS,
      FROM: env.SMTP_FROM,
    },
  };
};

export type AppConfig = ReturnType<typeof buildAppConfig>;
