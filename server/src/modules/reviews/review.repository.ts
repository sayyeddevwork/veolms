import { prisma } from "../../infrastructure/database/prisma.client.js";
import { CreateReviewInput, UpdateReviewInput } from "./review.types.js";

export const reviewRepository = {
  create: (userId: string, courseId: string, data: CreateReviewInput) => {
    return prisma.review.create({
      data: { userId, courseId, ...data },
      include: { user: { select: { name: true } } },
    });
  },

  findByUserAndCourse: (userId: string, courseId: string) => {
    return prisma.review.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  },

  findByCourse: (courseId: string) => {
    return prisma.review.findMany({
      where: { courseId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  update: (id: string, data: UpdateReviewInput) => {
    return prisma.review.update({
      where: { id },
      data,
      include: { user: { select: { name: true } } },
    });
  },

  delete: (id: string) => {
    return prisma.review.delete({ where: { id } });
  },

  findById: (id: string) => {
    return prisma.review.findUnique({ where: { id } });
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
};
