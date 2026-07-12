import { baseLogger } from "./pino.instance.js";
import { LogCategory } from "./logger.types.js";

const errorLogger = baseLogger.child({ category: LogCategory.ERROR });

export const logError = (err: unknown, context?: Record<string, unknown>) => {
  if (err instanceof Error) {
    errorLogger.error({ message: err.message, stack: err.stack, ...context });
  } else {
    errorLogger.error({ message: "Unknown error thrown", err, ...context });
  }
};
