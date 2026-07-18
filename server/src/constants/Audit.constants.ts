export const AuditAction = {
  USER_REGISTERED: "user.registered",
  USER_LOGIN: "user.login",
  USER_LOGIN_FAILED: "user.login_failed",
  USER_LOGOUT: "user.logout",
  USER_LOGOUT_ALL: "user.logout_all",
  SESSION_REVOKED: "session.revoked",
  PASSWORD_CHANGED: "password.changed",
  PASSWORD_RESET_REQUESTED: "password.reset_requested",
  PASSWORD_RESET_COMPLETED: "password.reset_completed",
  EMAIL_VERIFIED: "email.verified",
} as const;

export type AuditActionType = (typeof AuditAction)[keyof typeof AuditAction];
