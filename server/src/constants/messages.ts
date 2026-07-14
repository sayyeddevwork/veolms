export const Messages = {
  // Generic
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
  VALIDATION_FAILED: "Validation failed",
  ROUTE_NOT_FOUND: "Route not found",

  // Auth
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "You do not have permission to perform this action",
  TOKEN_EXPIRED: "Session expired, please log in again",

  // Resource-generic
  DUPLICATE_RESOURCE: "A record with these details already exists",
  RESOURCE_NOT_FOUND: "The requested resource was not found",

  // Server health
  SERVER_HEALTHY: "Server is healthy",
  SERVER_UNHEALTHY: "Server is unhealthy",
} as const;
