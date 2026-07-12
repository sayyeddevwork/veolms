import { baseLogger } from "./pino.instance.js";
import { LogCategory, SecurityEvent } from "./logger.types.js";

const securityLogger = baseLogger.child({ category: LogCategory.SECURITY });

export const logSecurityEvent = (event: SecurityEvent) => {
  const level = event.event === "invalid_webhook_signature" ? "error" : "warn";
  securityLogger[level](event);
};
