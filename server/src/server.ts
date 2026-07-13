import { config } from "./config/index.js";
import app from "./app.js";
import { prisma } from "./infrastructure/database/prisma.client.js";
import { logger } from "./infrastructure/logging/index.js";
import {
  DEFAULT_PRISMA_INIT_ERROR_MESSAGE,
  PRISMA_ERROR_MESSAGES,
  type PrismaErrorCode,
} from "./constants/prisma-error.codes.js";

let isShuttingDown = false;

const startServer = async () => {
  let server: ReturnType<typeof app.listen> | undefined;
  let isServerReady = false;

  // Setup signal handlers BEFORE any async operations, so a signal
  // arriving mid-startup is still handled gracefully instead of falling
  // back to Node's default behavior.
  const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    logger.info(`${signal} received. Starting graceful shutdown...`);

    // Server hasn't finished starting yet, nothing to close
    if (!server || !isServerReady) {
      logger.info("Server not fully started, skipping HTTP server close");
      try {
        logger.info("Disconnecting database...");
        await prisma.$disconnect();
        logger.info("Database disconnected.");
      } catch (error) {
        logger.error({ error }, "Error disconnecting database");
      }
      logger.info("Graceful shutdown completed.");
      process.exit(0);
      return;
    }

    logger.info("Closing HTTP server...");
    server.close(async (err) => {
      if (err) {
        logger.error({ err }, "Error closing HTTP server");
      } else {
        logger.info("HTTP server closed.");
      }
      logger.info("Disconnecting database...");
      try {
        await prisma.$disconnect();
        logger.info("Database disconnected.");
      } catch (error) {
        logger.error({ error }, "Error disconnecting database");
      }
      logger.info("Graceful shutdown completed.");
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

  try {
    // Connect to database with timeout
    const connectTimeout = 5000;
    let timeoutHandle: ReturnType<typeof setTimeout>;
    const connectPromise = prisma.$connect();
    const timeoutPromise = new Promise((_, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error("Database connection timeout")),
        connectTimeout,
      );
    });
    await Promise.race([connectPromise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    logger.info("Database connected successfully");

    // Start server
    server = app.listen(config.PORT, () => {
      isServerReady = true;
      logger.info(
        `${config.APP_NAME} is running on port ${config.PORT} [${config.NODE_ENV}]`,
      );
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Database connection timeout"
    ) {
      logger.error(`Database connection timeout after ${5000}ms`);
    } else if (
      error instanceof Error &&
      error.message in PRISMA_ERROR_MESSAGES
    ) {
      logger.fatal(
        { error },
        PRISMA_ERROR_MESSAGES[error.message as PrismaErrorCode],
      );
    } else {
      logger.fatal(
        { error },
        "Failed to connect to PostgreSQL database (host unreachable)",
      );
    }
    process.exit(1);
  }
};

// Handle process exit
process.on("beforeExit", async () => {
  if (!isShuttingDown) {
    await prisma.$disconnect();
  }
});

startServer();
