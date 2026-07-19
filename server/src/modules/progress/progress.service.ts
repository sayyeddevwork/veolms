import { progressRepository } from "./progress.repository.js";
import { lessonRepository } from "../lessons/lesson.repository.js";
import { enrollmentService } from "../enrollments/enrollment.service.js";
import { courseRepository } from "../courses/course.repository.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { AuthorizationError } from "../../shared/errors/AuthorizationError.js";
import { UpdateProgressInput } from "./progress.types.js";
import { prisma } from "../../infrastructure/database/prisma.client.js";
import { certificateService } from "../certificates/certificate.service.js";

// Walks lesson -> section -> course to find which course a lesson belongs to,
// so we can check enrollment before allowing progress updates.
const getCourseIdForLesson = async (lessonId: string): Promise<string> => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { select: { courseId: true } } },
  });
  if (!lesson) throw new NotFoundError("Lesson not found");
  return lesson.section.courseId;
};

export const progressService = {
  updateProgress: async (
    userId: string,
    lessonId: string,
    input: UpdateProgressInput,
  ) => {
    const courseId = await getCourseIdForLesson(lessonId);

    const isEnrolled = await enrollmentService.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new AuthorizationError(
        "You must be enrolled in this course to track progress",
      );
    }
    const progress = await progressRepository.upsert(userId, lessonId, input);
    if (input.completed) {
      await certificateService.checkAndIssueIfEligible(userId, courseId);
    }

    return progress;
  },

  getCourseProgress: async (userId: string, courseId: string) => {
    const isEnrolled = await enrollmentService.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new AuthorizationError(
        "You must be enrolled in this course to view progress",
      );
    }

    const [totalLessons, progressRecords] = await Promise.all([
      progressRepository.countLessonsInCourse(courseId),
      progressRepository.findByUserAndCourse(userId, courseId),
    ]);

    const completedLessons = progressRecords.filter((p) => p.completed).length;
    const percentComplete =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      courseId,
      totalLessons,
      completedLessons,
      percentComplete,
      lessons: progressRecords.map((p) => ({
        lessonId: p.lessonId,
        watchedSeconds: p.watchedSeconds,
        completed: p.completed,
        lastWatchedAt: p.lastWatchedAt,
      })),
    };
  },

  getContinueLearning: async (userId: string) => {
    const records = await progressRepository.findRecentlyWatched(userId);
    return records.map((p) => ({
      lessonId: p.lessonId,
      lessonTitle: p.lesson.title,
      watchedSeconds: p.watchedSeconds,
      courseId: p.lesson.section.course.id,
      courseTitle: p.lesson.section.course.title,
      courseThumbnail: p.lesson.section.course.thumbnail,
      lastWatchedAt: p.lastWatchedAt,
    }));
  },
};
