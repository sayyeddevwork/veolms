import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/app/RootLayout";
import { RequireAuth, RequireRole } from "@/app/RouteGuards";

// Route-level code splitting — each page ships as its own chunk so the
// initial bundle only pays for the shell (layout + auth bootstrap), not
// every page in the app.
const HomePage = lazy(() =>
  import("@/features/courses/pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const CourseListPage = lazy(() =>
  import("@/features/courses/pages/CourseListPage").then((m) => ({
    default: m.CourseListPage,
  })),
);
const CourseDetailPage = lazy(() =>
  import("@/features/courses/pages/CourseDetailPage").then((m) => ({
    default: m.CourseDetailPage,
  })),
);
const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  })),
);
const StudentDashboardPage = lazy(() =>
  import("@/features/student/pages/StudentDashboardPage").then((m) => ({
    default: m.StudentDashboardPage,
  })),
);
const AdminDashboardPage = lazy(() =>
  import("@/features/admin/pages/AdminDashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("@/app/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "courses", element: <CourseListPage /> },
      { path: "courses/:courseId", element: <CourseDetailPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <StudentDashboardPage />
          </RequireAuth>
        ),
      },
      {
        path: "admin",
        element: (
          <RequireRole role={["ADMIN", "INSTRUCTOR"]}>
            <AdminDashboardPage />
          </RequireRole>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
