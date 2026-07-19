import { Prisma } from "@prisma/client";
import { prisma } from "../../infrastructure/database/prisma.client.js";

export const courseRepository = {
  create: (data: Prisma.CourseCreateInput) => {
    return prisma.course.create({
      data,
    });
  },

  findPublished: () => {
    return prisma.course.findMany({
      where: { published: true },
      include: { sections: { include: { lessons: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findAllForAdmin: () => {
    return prisma.course.findMany({
      include: { sections: { include: { lessons: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: (id: string) => {
    return prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: { lessons: { orderBy: { order: "asc" } } },
        },
      },
    });
  },
  findOwnerId: async (id: string): Promise<string | null> => {
    const course = await prisma.course.findUnique({
      where: { id },
      select: { instructorId: true },
    });
    return course?.instructorId ?? null;
  },

  findOwnership: (id: string) => {
    return prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        instructorId: true,
      },
    });
  },

  update: (id: string, data: Prisma.CourseUpdateInput) => {
    return prisma.course.update({
      where: { id },
      data,
    });
  },

  delete: (id: string) => {
    return prisma.course.delete({ where: { id } });
  },

  exists: async (id: string): Promise<boolean> => {
    const count = await prisma.course.count({ where: { id } });
    return count > 0;
  },
};
