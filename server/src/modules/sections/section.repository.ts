import { prisma } from "../../infrastructure/database/prisma.client.js";
import { CreateSectionInput, UpdateSectionInput } from "./section.types.js";

export const sectionRepository = {
  create: (courseId: string, data: CreateSectionInput) => {
    return prisma.section.create({ data: { ...data, courseId } });
  },

  findById: (id: string) => {
    return prisma.section.findUnique({
      where: { id },
      include: { lessons: { orderBy: { order: "asc" } } },
    });
  },

  findByCourse: (courseId: string) => {
    return prisma.section.findMany({
      where: { courseId },
      include: { lessons: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });
  },

  update: (id: string, data: UpdateSectionInput) => {
    return prisma.section.update({ where: { id }, data });
  },

  delete: (id: string) => {
    return prisma.section.delete({ where: { id } });
  },

  // Confirms a section actually belongs to the given course — prevents
  // someone passing a valid sectionId that belongs to a DIFFERENT course.
  belongsToCourse: async (
    sectionId: string,
    courseId: string,
  ): Promise<boolean> => {
    const count = await prisma.section.count({
      where: { id: sectionId, courseId },
    });
    return count > 0;
  },
};
