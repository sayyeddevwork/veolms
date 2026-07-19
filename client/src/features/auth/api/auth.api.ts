import { api } from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { AuthUser, LoginInput, RegisterInput } from "@/types/auth";

export async function registerRequest(input: RegisterInput) {
  const { data } = await api.post<ApiSuccessResponse<{ user: AuthUser }>>(
    "/auth/register",
    input,
  );
  return data.data.user;
}

export async function loginRequest(input: LoginInput) {
  const { data } = await api.post<ApiSuccessResponse<{ user: AuthUser }>>(
    "/auth/login",
    input,
  );
  return data.data.user;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}

export async function fetchMe() {
  const { data } = await api.get<ApiSuccessResponse<AuthUser>>("/auth/me");
  return data.data;
}
