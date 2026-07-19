/**
 * Central query key registry. Every feature imports keys from here instead
 * of writing ad-hoc arrays — keeps invalidation and optimistic updates
 * (e.g. enrollment.mutations.ts, notifications.mutations.ts) from drifting
 * out of sync with queries.
 */
export const queryKeys = {
  courses: {
    all: ["courses"] as const,
    lists: () => [...queryKeys.courses.all, "list"] as const,
    list: (params?: { search?: string }) =>
      [...queryKeys.courses.lists(), params ?? {}] as const,
    details: () => [...queryKeys.courses.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    adminAll: () => [...queryKeys.courses.all, "admin-all"] as const,
  },
  enrollments: {
    all: ["enrollments"] as const,
    mine: () => [...queryKeys.enrollments.all, "mine"] as const,
    forCourse: (courseId: string) =>
      [...queryKeys.enrollments.all, "course", courseId] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    mine: () => [...queryKeys.notifications.all, "mine"] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    forCourse: (courseId: string) =>
      [...queryKeys.reviews.all, "course", courseId] as const,
  },
  progress: {
    all: ["progress"] as const,
    forLesson: (lessonId: string) =>
      [...queryKeys.progress.all, "lesson", lessonId] as const,
  },
} as const;
