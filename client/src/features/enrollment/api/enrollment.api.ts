import { api } from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { Enrollment } from "@/types/enrollment";

export async function fetchMyEnrollments(signal?: AbortSignal) {
  const { data } = await api.get<ApiSuccessResponse<{ enrollments: Enrollment[] }>>(
    "/enrollment/me",
    { signal },
  );
  return data.data.enrollments;
}

export async function enrollFreeRequest(courseId: string) {
  const { data } = await api.post<ApiSuccessResponse<{ enrollment: Enrollment }>>(
    `/enrollment/courses/${courseId}/enroll`,
  );
  return data.data.enrollment;
}
