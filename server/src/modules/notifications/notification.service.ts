import { notificationRepository } from "./notification.repository.js";
import { CreateNotificationInput } from "./notification.types.js";
import { sendMail } from "../../infrastructure/mail/mail.client.js";
import { logger } from "../../infrastructure/logging/index.js";

// Notification types that also trigger an email, in addition to the in-app record.
const EMAIL_ENABLED_TYPES = new Set([
  "ENROLLMENT_SUCCESS",
  "CERTIFICATE_ISSUED",
]);

export const notificationService = {
  // Fire-and-forget by design: notification failures should never break the
  // primary action (enrollment, certificate issuance, etc.) that triggered them.
  notify: async (input: CreateNotificationInput, recipientEmail?: string) => {
    try {
      await notificationRepository.create(input);
    } catch (error) {
      logger.error({ error, input }, "Failed to create in-app notification");
    }

    if (recipientEmail && EMAIL_ENABLED_TYPES.has(input.type)) {
      try {
        await sendMail({
          to: recipientEmail,
          subject: input.title,
          html: `<p>${input.message}</p>`,
        });
      } catch (error) {
        logger.error({ error, input }, "Failed to send notification email");
      }
    }
  },

  listForUser: async (userId: string) => {
    const [notifications, unreadCount] = await Promise.all([
      notificationRepository.findByUser(userId),
      notificationRepository.countUnread(userId),
    ]);
    return { notifications, unreadCount };
  },

  markAsRead: async (id: string, userId: string) => {
    await notificationRepository.markAsRead(id, userId);
  },

  markAllAsRead: async (userId: string) => {
    await notificationRepository.markAllAsRead(userId);
  },
};
