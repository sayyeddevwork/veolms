import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import type { UserRole } from "@/types/auth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, status } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (status === "idle" || status === "loading") {
    return null; // could render a splash/skeleton here
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function RequireRole({
  role,
  children,
}: {
  role: UserRole | UserRole[];
  children: ReactNode;
}) {
  const { user, status } = useAppSelector((s) => s.auth);
  const allowed = Array.isArray(role) ? role : [role];

  if (status === "idle" || status === "loading") {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
