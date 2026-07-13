import { PrismaClient, Prisma } from "@prisma/client";
import { config } from "../../config/index.js";
import { logger } from "../logging/index.js";

const SLOW_QUERY_THRESHOLD_MS = config.app.slowQueryThresholdMs;

const createPrismaClient = () =>
  new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
    ],
  });

declare global {
  // eslint-disable-next-line no-var
  var __prisma: ReturnType<typeof createPrismaClient> | undefined;
}

const prisma = global.__prisma ?? createPrismaClient();

if (!config.app.isProduction) {
  global.__prisma = prisma;
}

prisma.$on("query", (event: Prisma.QueryEvent) => {
  if (event.duration > SLOW_QUERY_THRESHOLD_MS) {
    logger.warn(
      {
        query: event.query,
        duration: event.duration,
        params: config.app.isProduction ? "[REDACTED]" : event.params,
      },
      "Slow query detected",
    );
    return;
  }

  if (config.app.isProduction) return;
  logger.trace(
    { query: event.query, params: event.params, duration: event.duration },
    "Prisma query",
  );
});

prisma.$on("error", (event: Prisma.LogEvent) => {
  logger.error({ message: event.message }, "Prisma error");
});

prisma.$on("warn", (event: Prisma.LogEvent) => {
  logger.warn({ message: event.message }, "Prisma warning");
});

export { prisma, Prisma };
