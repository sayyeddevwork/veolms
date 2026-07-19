import { prisma } from "../../infrastructure/database/prisma.client.js";

export const certificateRepository = {
  create: (userId: string, courseId: string) => {
    return prisma.certificate.create({ data: { userId, courseId } });
  },

  findByUserAndCourse: (userId: string, courseId: string) => {
    return prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  },

  findByUser: (userId: string) => {
    return prisma.certificate.findMany({
      where: { userId },
      include: { course: { select: { title: true } } },
      orderBy: { issuedAt: "desc" },
    });
  },

  findByVerificationCode: (code: string) => {
    return prisma.certificate.findUnique({
      where: { verificationCode: code },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
      },
    });
  },

  findById: (id: string) => {
    return prisma.certificate.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
      },
    });
  },
};
