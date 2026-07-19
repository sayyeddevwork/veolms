import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/authSlice";
import { logoutRequest } from "@/features/auth/api/auth.api";
import { Skeleton } from "@/components/ui/Skeleton";

export function RootLayout() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  async function handleLogout() {
    await logoutRequest();
    dispatch(setUser(null));
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="border-b border-line/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl tracking-tight">
            VeoLMS
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/courses">Courses</Link>
            {user ? (
              <>
                {user.role === "ADMIN" && <Link to="/admin">Admin</Link>}
                {user.role === "INSTRUCTOR" && <Link to="/admin">Teach</Link>}
                <Link to="/dashboard">My Learning</Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-ink px-4 py-1.5 text-paper"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link
                  to="/register"
                  className="rounded-full bg-signal px-4 py-1.5 text-ink"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-6 py-16">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="mt-4 h-40 w-full" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t border-line/10 py-8 text-center text-sm text-ink/60">
        © {new Date().getFullYear()} VeoLMS
      </footer>
    </div>
  );
}
