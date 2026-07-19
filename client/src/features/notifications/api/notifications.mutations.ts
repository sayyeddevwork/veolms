import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import type { Notification } from "@/types/notification";
import { markNotificationReadRequest } from "./notifications.api";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const key = queryKeys.notifications.mine();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationReadRequest(notificationId),

    onMutate: async (notificationId: string) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Notification[]>(key);

      queryClient.setQueryData<Notification[]>(key, (old = []) =>
        old.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );

      return { previous };
    },

    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
