import { UserRole } from "../../shared/types/roles.js";
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
