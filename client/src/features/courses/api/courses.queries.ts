import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchCourseById, fetchPublishedCourses } from "./courses.api";

/**
 * Public course catalog. Long staleTime — instructors don't publish/update
 * courses every minute, and this is the data we persist to localStorage
 * (see src/lib/queryClient.ts), so a returning visitor sees courses
 * instantly while this refetches quietly in the background.
 */
export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses.list(),
    queryFn: ({ signal }) => fetchPublishedCourses(signal),
    staleTime: 5 * 60_000,
  });
}

export function useCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.courses.detail(courseId ?? ""),
    queryFn: ({ signal }) => fetchCourseById(courseId as string, signal),
    enabled: Boolean(courseId),
    staleTime: 2 * 60_000,
  });
}
