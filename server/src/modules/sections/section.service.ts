import { sectionRepository } from "./section.repository.js";
import { courseRepository } from "../courses/course.repository.js";
import { CreateSectionInput, UpdateSectionInput } from "./section.types.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { AuthorizationError } from "../../shared/errors/AuthorizationError.js";
import { UserRole } from "../../shared/types/roles.js";
import auditService from "../audit/Audit.service.js";
import { AuditAction } from "../audit/Audit.types.js";

const assertCanModifyCourse = async (
  courseId: string,
  actorId: string,
  role: UserRole,
) => {
  if (role === UserRole.ADMIN) return;
  const ownerId = await courseRepository.findOwnerId(courseId);
  if (!ownerId) throw new NotFoundError("Course not found");
  if (ownerId !== actorId) {
    throw new AuthorizationError(
      "You can only modify sections of your own courses",
    );
  }
};

export const sectionService = {
  create: async (
    courseId: string,
    input: CreateSectionInput,
    actorId: string,
    role: UserRole,
    ip?: string,
  ) => {
    await assertCanModifyCourse(courseId, actorId, role);
    const section = await sectionRepository.create(courseId, input);

    await auditService.recordAuditLog({
      actorId,
      action: AuditAction.LESSON_CREATED, // reuse or add SECTION_CREATED below
      targetId: section.id,
      metadata: { courseId, title: section.title },
      ip,
    });

    return section;
  },

  listByCourse: async (courseId: string) => {
    const courseExists = await courseRepository.exists(courseId);
    if (!courseExists) throw new NotFoundError("Course not found");
    return sectionRepository.findByCourse(courseId);
  },

  update: async (
    courseId: string,
    sectionId: string,
    input: UpdateSectionInput,
    actorId: string,
    role: UserRole,
    ip?: string,
  ) => {
    await assertCanModifyCourse(courseId, actorId, role);

    const belongs = await sectionRepository.belongsToCourse(
      sectionId,
      courseId,
    );
    if (!belongs) throw new NotFoundError("Section not found in this course");

    return sectionRepository.update(sectionId, input);
  },

  delete: async (
    courseId: string,
    sectionId: string,
    actorId: string,
    role: UserRole,
    ip?: string,
  ) => {
    await assertCanModifyCourse(courseId, actorId, role);

    const belongs = await sectionRepository.belongsToCourse(
      sectionId,
      courseId,
    );
    if (!belongs) throw new NotFoundError("Section not found in this course");

    await sectionRepository.delete(sectionId);
  },
};
