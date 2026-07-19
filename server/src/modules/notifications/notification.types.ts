export interface CreateNotificationInput {
  userId: string;
  type:
    | "ENROLLMENT_SUCCESS"
    | "CERTIFICATE_ISSUED"
    | "NEW_REVIEW"
    | "COURSE_PUBLISHED";
  title: string;
  message: string;
  link?: string;
}

export interface NotificationView {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}
