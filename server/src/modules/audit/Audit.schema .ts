import { z } from "zod";

export const listAuditLogsSchema = {
  query: z.object({
    actorId: z.string().optional(),
    action: z.string().optional(),
    targetId: z.string().optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export const getAuditLogSchema = {
  params: z.object({
    id: z.string().min(1, "Invalid audit log id"),
  }),
};
