import { Prisma } from "../../infrastructure/database/prisma.client.js";
import { prisma } from "../../infrastructure/database/prisma.client.js";
import { logger } from "../../infrastructure/logging/index.js";

interface RecordAuditLogInput {
  actorId: string;
  action: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
}

/**
 * Records an audit log entry.
 *
 * Deliberately NEVER throws — audit logging is a side effect, not the
 * primary purpose of any request. If writing the log fails (e.g. transient
 * DB issue), we log the failure ourselves and let the original request
 * succeed rather than failing a login/password-change because of it.
 */
export const recordAuditLog = async (
  input: RecordAuditLogInput,
): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        targetId: input.targetId,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
        ip: input.ip,
      },
    });
  } catch (err) {
    logger.error(
      { err, action: input.action, actorId: input.actorId },
      "Failed to write audit log",
    );
  }
};

export interface ListAuditLogsFilters {
  actorId?: string;
  action?: string;
  targetId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page: number;
  limit: number;
}

export const listAuditLogs = async (filters: ListAuditLogsFilters) => {
  const where: Prisma.AuditLogWhereInput = {
    ...(filters.actorId && { actorId: filters.actorId }),
    ...(filters.action && { action: filters.action }),
    ...(filters.targetId && { targetId: filters.targetId }),
    ...((filters.dateFrom || filters.dateTo) && {
      createdAt: {
        ...(filters.dateFrom && { gte: filters.dateFrom }),
        ...(filters.dateTo && { lte: filters.dateTo }),
      },
    }),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
};

export const getAuditLogById = async (id: string) => {
  return prisma.auditLog.findUnique({
    where: { id },
    include: {
      actor: { select: { id: true, name: true, email: true, role: true } },
    },
  });
};

export default {
  recordAuditLog,
  listAuditLogs,
  getAuditLogById,
};
