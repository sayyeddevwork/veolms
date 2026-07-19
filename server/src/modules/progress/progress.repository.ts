import { prisma } from "../../infrastructure/database/prisma.client.js";
import { UpdateProgressInput } from "./progress.types.js";

export const progressRepository = {
  upsert: (userId: string, lessonId: string, data: UpdateProgressInput) => {
    return prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        watchedSeconds: data.watchedSeconds,
        completed: data.completed ?? false,
      },
      update: {
        watchedSeconds: data.watchedSeconds,
        completed: data.completed ?? undefined,
        lastWatchedAt: new Date(),
      },
    });
  },

  findByUserAndLesson: (userId: string, lessonId: string) => {
    return prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
  },

  findByUserAndCourse: (userId: string, courseId: string) => {
    return prisma.progress.findMany({
      where: {
        userId,
        lesson: { section: { courseId } },
      },
    });
  },

  countLessonsInCourse: (courseId: string) => {
    return prisma.lesson.count({
      where: { section: { courseId } },
    });
  },

  // "Continue learning" — most recently watched, incomplete lessons across all enrolled courses
  findRecentlyWatched: (userId: string, limit = 5) => {
    return prisma.progress.findMany({
      where: { userId, completed: false },
      include: {
        lesson: {
          include: {
            section: {
              include: {
                course: { select: { id: true, title: true, thumbnail: true } },
              },
            },
          },
        },
      },
      orderBy: { lastWatchedAt: "desc" },
      take: limit,
    });
  },
};
