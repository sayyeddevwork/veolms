import pino from "pino";
import { config } from "../../config/index.js";

export const baseLogger = pino({
  level: config.app.logLevel,
  redact: {
    paths: [
      "password",
      "token",
      "accessToken",
      "refreshToken",
      "*.password",
      "*.token",
      "*.accessToken",
      "*.refreshToken",
      "req.headers.authorization",
      "req.headers.cookie",
      "razorpayKeySecret",
      "*.razorpayKeySecret",
      "jwtSecret",
      "*.jwtSecret",
    ],
    censor: "[REDACTED]",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: config.app.logPretty
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname,req,res,responseTime",
          messageFormat: "{msg}{if responseTime} {responseTime}ms{end}",
        },
      }
    : undefined,
});
