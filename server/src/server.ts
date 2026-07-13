import { config } from "./config/index.js";
import app from "./app.js";
import { prisma } from "./infrastructure/database/prisma.client.js";
import { logger } from "./infrastructure/logging/index.js";

let isShuttingDown = false;

const startServer = async () => {
  // Fail fast if the database is unreachable before accepting any traffic
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error({ error }, "Failed to connect to database");
    process.exit(1);
  }

  const server = app.listen(config.PORT, () => {
    logger.info(
      `${config.APP_NAME} is running on port ${config.PORT} [${config.NODE_ENV}]`,
    );
  });

  const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`${signal} received, shutting down gracefully`);

    server.close(async (err) => {
      if (err) {
        logger.error({ err }, "Error closing HTTP server");
      }

      try {
        await prisma.$disconnect();
        logger.info("Database disconnected");
      } catch (error) {
        logger.error({ error }, "Error disconnecting database");
      }

      process.exit(0);
    });

    // Force exit if shutdown hangs (e.g. a stuck request or query)
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled promise rejection");
    gracefulShutdown("unhandledRejection");
  });

  process.on("uncaughtException", (error) => {
    logger.error({ error }, "Uncaught exception");
    gracefulShutdown("uncaughtException");
  });
};

startServer();
