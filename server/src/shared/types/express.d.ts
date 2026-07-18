import { UserRole } from "./roles.ts";
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      sessionId?: string;
    }
  }
}

export {};
