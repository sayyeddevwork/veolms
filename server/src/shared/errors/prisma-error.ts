import { Prisma } from "@prisma/client";
import {
  DEFAULT_PRISMA_INIT_ERROR_MESSAGE,
  PRISMA_ERROR_MESSAGES,
  type PrismaErrorCode,
} from "../../constants/prisma-error.codes.js";

export function getPrismaInitializationErrorMessage(
  error: Prisma.PrismaClientInitializationError,
): string {
  const code = error.errorCode as PrismaErrorCode | undefined;

  return code
    ? (PRISMA_ERROR_MESSAGES[code] ?? DEFAULT_PRISMA_INIT_ERROR_MESSAGE)
    : DEFAULT_PRISMA_INIT_ERROR_MESSAGE;
}
