import { api } from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { CourseDetail, CourseListItem } from "@/types/course";

export async function fetchPublishedCourses(signal?: AbortSignal) {
  const { data } = await api.get<ApiSuccessResponse<{ courses: CourseListItem[] }>>(
    "/courses",
    { signal },
  );
  return data.data.courses;
}

export async function fetchCourseById(id: string, signal?: AbortSignal) {
  const { data } = await api.get<ApiSuccessResponse<{ course: CourseDetail }>>(
    `/courses/${id}`,
    { signal },
  );
  return data.data.course;
}
