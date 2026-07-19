export interface InstructorCourseAnalytics {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
}

export interface InstructorOverview {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  courses: InstructorCourseAnalytics[];
}

export interface AdminPlatformOverview {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentSignups: number; // last 7 days
}
