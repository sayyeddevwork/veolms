export interface AuthenticatedUser {
  id: string;
  email: string;
  role: "STUDENT" | "ADMIN";
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
