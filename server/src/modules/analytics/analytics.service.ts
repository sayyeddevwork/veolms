import { analyticsRepository } from "./analytics.repository.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { UserRole } from "../../shared/types/roles.js";

export const analyticsService = {
  getInstructorOverview: async (instructorId: string) => {
    const courses =
      await analyticsRepository.getInstructorCourses(instructorId);

    const courseAnalytics = await Promise.all(
      courses.map(async (course) => {
        const [enrollments, revenue, ratingSummary, completionRate] =
          await Promise.all([
            analyticsRepository.getCourseEnrollmentCount(course.id),
            analyticsRepository.getCourseRevenue(course.id),
            analyticsRepository.getCourseRatingSummary(course.id),
            analyticsRepository.getCourseCompletionRate(course.id),
          ]);

        return {
          courseId: course.id,
          courseTitle: course.title,
          totalEnrollments: enrollments,
          totalRevenue: revenue,
          averageRating: ratingSummary.averageRating,
          totalReviews: ratingSummary.totalReviews,
          completionRate,
        };
      }),
    );

    const totalStudents = courseAnalytics.reduce(
      (sum, c) => sum + c.totalEnrollments,
      0,
    );
    const totalRevenue = courseAnalytics.reduce(
      (sum, c) => sum + c.totalRevenue,
      0,
    );

    return {
      totalCourses: courses.length,
      totalStudents,
      totalRevenue,
      courses: courseAnalytics,
    };
  },

  getInstructorOverviewById: async (instructorId: string) => {
    const instructor =
      await analyticsRepository.findInstructorById(instructorId);

    if (!instructor || instructor.role !== UserRole.INSTRUCTOR) {
      throw new NotFoundError("Instructor not found");
    }

    const overview = await analyticsService.getInstructorOverview(instructorId);

    return {
      instructor: { id: instructor.id, name: instructor.name },
      ...overview,
    };
  },

  getAdminOverview: async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      userCounts,
      courseCounts,
      totalEnrollments,
      totalRevenue,
      recentSignups,
    ] = await Promise.all([
      analyticsRepository.getUserCounts(),
      analyticsRepository.getCourseCounts(),
      analyticsRepository.getTotalEnrollments(),
      analyticsRepository.getTotalRevenue(),
      analyticsRepository.getRecentSignupCount(sevenDaysAgo),
    ]);

    return {
      totalUsers: userCounts.total,
      totalStudents: userCounts.students,
      totalInstructors: userCounts.instructors,
      totalCourses: courseCounts.total,
      publishedCourses: courseCounts.published,
      totalEnrollments,
      totalRevenue,
      recentSignups,
    };
  },
};
