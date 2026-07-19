import { prisma } from "../../infrastructure/database/prisma.client.js";

export const analyticsRepository = {
  // ---- Instructor-level ----

  getInstructorCourses: (instructorId: string) => {
    return prisma.course.findMany({
      where: { instructorId },
      select: { id: true, title: true },
    });
  },

  getCourseEnrollmentCount: (courseId: string) => {
    return prisma.enrollment.count({ where: { courseId } });
  },

  getCourseRevenue: async (courseId: string): Promise<number> => {
    const result = await prisma.payment.aggregate({
      where: { courseId, status: "PAID" },
      _sum: { amount: true },
    });
    return result._sum.amount ?? 0;
  },

  getCourseRatingSummary: async (courseId: string) => {
    const result = await prisma.review.aggregate({
      where: { courseId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      averageRating: result._avg.rating
        ? Math.round(result._avg.rating * 10) / 10
        : 0,
      totalReviews: result._count.rating,
    };
  },

  findInstructorById: (instructorId: string) => {
    return prisma.user.findUnique({
      where: { id: instructorId },
      select: { id: true, name: true, role: true },
    });
  },

  getCourseCompletionRate: async (courseId: string): Promise<number> => {
    const totalLessons = await prisma.lesson.count({
      where: { section: { courseId } },
    });
    if (totalLessons === 0) return 0;

    const enrolledUserIds = await prisma.enrollment.findMany({
      where: { courseId },
      select: { userId: true },
    });
    if (enrolledUserIds.length === 0) return 0;

    const completedCounts = (await Promise.all(
      enrolledUserIds.map(async ({ userId }) => {
        const completed = await prisma.progress.count({
          where: { userId, completed: true, lesson: { section: { courseId } } },
        });
        return completed >= totalLessons ? 1 : 0;
      }),
    )) as number[];

    const fullyCompletedCount = completedCounts.reduce(
      (sum, val) => sum + val,
      0,
    );
    return Math.round((fullyCompletedCount / enrolledUserIds.length) * 100);
  },

  // ---- Admin-level ----

  getUserCounts: async () => {
    const [total, students, instructors] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "INSTRUCTOR" } }),
    ]);
    return { total, students, instructors };
  },

  getCourseCounts: async () => {
    const [total, published] = await Promise.all([
      prisma.course.count(),
      prisma.course.count({ where: { published: true } }),
    ]);
    return { total, published };
  },

  getTotalEnrollments: () => prisma.enrollment.count(),

  getTotalRevenue: async (): Promise<number> => {
    const result = await prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });
    return result._sum.amount ?? 0;
  },

  getRecentSignupCount: (since: Date) => {
    return prisma.user.count({ where: { createdAt: { gte: since } } });
  },
};
