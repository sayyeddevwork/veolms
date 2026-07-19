import { prisma } from "../../infrastructure/database/prisma.client.js";
import { CreateLessonInput, UpdateLessonInput } from "./lesson.types.js";

export const lessonRepository = {
  create: (sectionId: string, data: CreateLessonInput) => {
    return prisma.lesson.create({ data: { ...data, sectionId } });
  },

  findById: (id: string) => {
    return prisma.lesson.findUnique({ where: { id } });
  },

  update: (id: string, data: UpdateLessonInput) => {
    return prisma.lesson.update({ where: { id }, data });
  },

  delete: (id: string) => {
    return prisma.lesson.delete({ where: { id } });
  },

  belongsToSection: async (
    lessonId: string,
    sectionId: string,
  ): Promise<boolean> => {
    const count = await prisma.lesson.count({
      where: { id: lessonId, sectionId },
    });
    return count > 0;
  },
};
