export const ROUTES = {
  API_PREFIX: "/api",
  API_VERSION: "v1",

  HEALTH: "/health",
  AUTH: "/auth",
  USERS: "/users",
  COURSES: "/courses",
  LESSONS: "/lessons",
  ENROLLMENTS: "/enrollments",
  PAYMENTS: "/payments",
} as const;

export const API_BASE_PATH = `${ROUTES.API_PREFIX}/${ROUTES.API_VERSION}`;
