import { prisma } from "../../infrastructure/database/prisma.client.js";

export const enrollmentRepository = {
  create: (userId: string, courseId: string, paymentId?: string) => {
    return prisma.enrollment.create({
      data: { userId, courseId, paymentId },
    });
  },

  findByUserAndCourse: (userId: string, courseId: string) => {
    return prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  },

  isEnrolled: async (userId: string, courseId: string): Promise<boolean> => {
    const count = await prisma.enrollment.count({
      where: { userId, courseId },
    });
    return count > 0;
  },

  findMyEnrollments: (userId: string) => {
    return prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: { select: { id: true, title: true, thumbnail: true } },
      },
      orderBy: { enrolledAt: "desc" },
    });
  },

  findCourseEnrollments: (courseId: string) => {
    return prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { enrolledAt: "desc" },
    });
  },
};
