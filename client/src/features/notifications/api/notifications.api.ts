import { api } from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { Notification } from "@/types/notification";

export async function fetchMyNotifications(signal?: AbortSignal) {
  const { data } = await api.get<ApiSuccessResponse<{ notifications: Notification[] }>>(
    "/notifications",
    { signal },
  );
  return data.data.notifications;
}

export async function markNotificationReadRequest(id: string) {
  await api.patch(`/notifications/${id}/read`);
}
