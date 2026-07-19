import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchMyEnrollments } from "./enrollment.api";
import { useAppSelector } from "@/store/hooks";

export function useMyEnrollments() {
  const isAuthenticated = useAppSelector((s) => Boolean(s.auth.user));

  return useQuery({
    queryKey: queryKeys.enrollments.mine(),
    queryFn: ({ signal }) => fetchMyEnrollments(signal),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}
