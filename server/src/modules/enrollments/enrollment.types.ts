export interface EnrollmentSummary {
  id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  enrolledAt: Date;
}

export interface CourseEnrollmentView {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  enrolledAt: Date;
}
