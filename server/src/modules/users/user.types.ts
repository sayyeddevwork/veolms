export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  isEmailVerified: boolean;
  createdAt: Date;
}

export interface UpdateProfileInput {
  name?: string;
}
