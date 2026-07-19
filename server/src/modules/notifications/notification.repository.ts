import { prisma } from "../../infrastructure/database/prisma.client.js";
import { CreateNotificationInput } from "./notification.types.js";

export const notificationRepository = {
  create: (data: CreateNotificationInput) => {
    return prisma.notification.create({ data });
  },

  findByUser: (userId: string, limit = 50) => {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  countUnread: (userId: string) => {
    return prisma.notification.count({ where: { userId, isRead: false } });
  },

  markAsRead: (id: string, userId: string) => {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  },

  markAllAsRead: (userId: string) => {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },
};
