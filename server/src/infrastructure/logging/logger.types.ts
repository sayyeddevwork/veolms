export enum LogCategory {
  APPLICATION = "application",
  REQUEST = "request",
  SECURITY = "security",
  ERROR = "error",
}

export interface SecurityEventBase {
  ip: string;
}

export interface FailedLoginEvent extends SecurityEventBase {
  event: "failed_login";
  email: string;
}

export interface RateLimitEvent extends SecurityEventBase {
  event: "rate_limit_exceeded";
  route: string;
}

export interface UnauthorizedAccessEvent extends SecurityEventBase {
  event: "unauthorized_access_attempt";
  userId?: string;
  route: string;
}

export interface InvalidWebhookSignatureEvent extends SecurityEventBase {
  event: "invalid_webhook_signature";
  source: string;
}

export type SecurityEvent =
  | FailedLoginEvent
  | RateLimitEvent
  | UnauthorizedAccessEvent
  | InvalidWebhookSignatureEvent;
