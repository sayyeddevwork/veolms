export enum AuditAction {
  COURSE_CREATED = "course.created",
  COURSE_UPDATED = "course.updated",
  COURSE_DELETED = "course.deleted",
  LESSON_CREATED = "lesson.created",
  LESSON_DELETED = "lesson.deleted",
  USER_ROLE_CHANGED = "user.role_changed",
  ENROLLMENT_MANUALLY_GRANTED = "enrollment.manually_granted",
  USER_REGISTERED = "user.registered",
  USER_LOGIN = "user.login",
  USER_LOGOUT = "user.logout",
}

export interface RecordAuditLogInput {
  actorId: string;
  action: AuditAction;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
}

export interface ListAuditLogsFilters {
  actorId?: string;
  action?: AuditAction;
  targetId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page: number;
  limit: number;
}

export interface AuditLogActor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  ip: string | null;
  createdAt: Date;
  actor: AuditLogActor;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedAuditLogs {
  logs: AuditLogEntry[];
  pagination: PaginationMeta;
}
