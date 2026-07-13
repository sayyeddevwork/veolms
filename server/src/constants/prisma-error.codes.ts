export type PrismaErrorCode =
  | "P1000"
  | "P1001"
  | "P1002"
  | "P1003"
  | "P1008"
  | "P1010";

export const PRISMA_ERROR_MESSAGES: Record<PrismaErrorCode, string> = {
  P1000: "Failed to authenticate with PostgreSQL database (check credentials)",
  P1001: "Failed to connect to PostgreSQL database (host unreachable)",
  P1002: "PostgreSQL database connection timed out",
  P1003: "PostgreSQL database does not exist",
  P1008: "PostgreSQL database operation timed out",
  P1010: "PostgreSQL database access denied for user",
};
export const DEFAULT_PRISMA_INIT_ERROR_MESSAGE =
  "Failed to initialize PostgreSQL database";
