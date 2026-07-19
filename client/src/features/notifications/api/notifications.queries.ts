import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { useAppSelector } from "@/store/hooks";
import { fetchMyNotifications } from "./notifications.api";

export function useMyNotifications() {
  const isAuthenticated = useAppSelector((s) => Boolean(s.auth.user));

  return useQuery({
    queryKey: queryKeys.notifications.mine(),
    queryFn: ({ signal }) => fetchMyNotifications(signal),
    enabled: isAuthenticated,
    staleTime: 15_000,
    refetchInterval: 60_000, // light polling so a bell icon feels live without a socket
  });
}
