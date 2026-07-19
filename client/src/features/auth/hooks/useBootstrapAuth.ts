import { useEffect } from "react";
import { fetchMe } from "@/features/auth/api/auth.api";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setStatus } from "@/store/authSlice";

/**
 * Calls GET /auth/me once when the app mounts to hydrate the auth slice
 * from the httpOnly session cookie. Renders nothing; mount once near the root.
 */
export function useBootstrapAuth() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;
    dispatch(setStatus("loading"));

    fetchMe()
      .then((user) => {
        if (!cancelled) dispatch(setUser(user));
      })
      .catch(() => {
        if (!cancelled) dispatch(setUser(null));
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);
}
