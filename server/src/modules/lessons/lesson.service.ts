import { lessonRepository } from "./lesson.repository.js";
import { sectionRepository } from "../sections/section.repository.js";
import { courseRepository } from "../courses/course.repository.js";
import { CreateLessonInput, UpdateLessonInput } from "./lesson.types.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { AuthorizationError } from "../../shared/errors/AuthorizationError.js";
import { UserRole } from "../../shared/types/roles.js";
import auditService from "../audit/Audit.service.js";
import { LessonAction } from "../../constants/lesson.constants.js";

const assertCanModify = async (
  courseId: string,
  sectionId: string,
  actorId: string,
  role: UserRole,
) => {
  const sectionBelongs = await sectionRepository.belongsToCourse(
    sectionId,
    courseId,
  );
  if (!sectionBelongs)
    throw new NotFoundError("Section not found in this course");

  if (role === UserRole.ADMIN) return;

  const ownerId = await courseRepository.findOwnerId(courseId);
  if (!ownerId) throw new NotFoundError("Course not found");
  if (ownerId !== actorId) {
    throw new AuthorizationError(
      "You can only modify lessons in your own courses",
    );
  }
};

export const lessonService = {
  create: async (
    courseId: string,
    sectionId: string,
    input: CreateLessonInput,
    actorId: string,
    role: UserRole,
    ip?: string,
  ) => {
    await assertCanModify(courseId, sectionId, actorId, role);

    const lesson = await lessonRepository.create(sectionId, input);

    await auditService.recordAuditLog({
      actorId,
      action: LessonAction.LESSON_CREATED,
      targetId: lesson.id,
      metadata: { courseId, sectionId, title: lesson.title },
      ip,
    });

    return lesson;
  },

  update: async (
    courseId: string,
    sectionId: string,
    lessonId: string,
    input: UpdateLessonInput,
    actorId: string,
    role: UserRole,
    ip?: string,
  ) => {
    await assertCanModify(courseId, sectionId, actorId, role);

    const belongs = await lessonRepository.belongsToSection(
      lessonId,
      sectionId,
    );
    if (!belongs) throw new NotFoundError("Lesson not found in this section");

    return lessonRepository.update(lessonId, input);
  },

  delete: async (
    courseId: string,
    sectionId: string,
    lessonId: string,
    actorId: string,
    role: UserRole,
    ip?: string,
  ) => {
    await assertCanModify(courseId, sectionId, actorId, role);

    const belongs = await lessonRepository.belongsToSection(
      lessonId,
      sectionId,
    );
    if (!belongs) throw new NotFoundError("Lesson not found in this section");

    await lessonRepository.delete(lessonId);

    await auditService.recordAuditLog({
      actorId,
      action: LessonAction.LESSON_DELETED,
      targetId: lessonId,
      metadata: { courseId, sectionId },
      ip,
    });
  },
};
