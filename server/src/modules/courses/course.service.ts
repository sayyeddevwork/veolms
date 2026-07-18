import { courseRepository } from "./course.repository.js";
import { CreateCourseInput, UpdateCourseInput } from "./course.types.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { AuthorizationError } from "../../shared/errors/AuthorizationError.js";
import auditService from "../audit/Audit.service.js";
import { CourseAction } from "../../constants/course.constants.js";
import { AuthenticatedUser } from "../../shared/types/express.js";
import { UserRole } from "../../shared/types/roles.js";

// Strips lesson videoRef for non-preview lessons when the requester isn't enrolled.
const toPublicCourse = (course: any, isEnrolled: boolean) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  thumbnail: course.thumbnail,
  price: course.price,
  published: course.published,
  sections: course.sections.map((section: any) => ({
    id: section.id,
    title: section.title,
    order: section.order,
    lessons: section.lessons.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration,
      isPreview: lesson.isPreview,
      order: lesson.order,
      videoRef: lesson.isPreview || isEnrolled ? lesson.videoRef : null,
    })),
  })),
});

const ensureInstructorOwnsCourse = async (
  courseId: string,
  currentUser: AuthenticatedUser,
) => {
  const course = await courseRepository.findOwnership(courseId);

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  if (
    currentUser.role === UserRole.INSTRUCTOR &&
    course.instructorId !== currentUser.id
  ) {
    throw new AuthorizationError(
      "You cannot modify another instructor's course.",
    );
  }

  return course;
};

export const courseService = {
  create: async (
    input: CreateCourseInput,
    currentUser: AuthenticatedUser,
    ip?: string,
  ) => {
    const course = await courseRepository.create({
      title: input.title,
      description: input.description,
      thumbnail: input.thumbnail,
      price: input.price,

      instructor: {
        connect: {
          id: currentUser.id,
        },
      },
    });

    await auditService.recordAuditLog({
      actorId: currentUser.id,
      action: CourseAction.COURSE_CREATED,
      targetId: course.id,
      metadata: {
        title: course.title,
      },
      ip,
    });

    return course;
  },

  listPublished: async () => {
    const courses = await courseRepository.findPublished();

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      price: course.price,
      lessonCount: course.sections.reduce(
        (sum, section) => sum + section.lessons.length,
        0,
      ),
    }));
  },

  listAllForAdmin: async () => {
    return courseRepository.findAllForAdmin();
  },

  getById: async (id: string, isEnrolled = false) => {
    const course = await courseRepository.findById(id);

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    return toPublicCourse(course, isEnrolled);
  },

  update: async (
    id: string,
    input: UpdateCourseInput,
    currentUser: AuthenticatedUser,
    ip?: string,
  ) => {
    await ensureInstructorOwnsCourse(id, currentUser);

    const course = await courseRepository.update(id, input);

    await auditService.recordAuditLog({
      actorId: currentUser.id,
      action: CourseAction.COURSE_UPDATED,
      targetId: id,
      metadata: {
        changes: input,
      },
      ip,
    });

    return course;
  },

  delete: async (id: string, currentUser: AuthenticatedUser, ip?: string) => {
    await ensureInstructorOwnsCourse(id, currentUser);

    await courseRepository.delete(id);

    await auditService.recordAuditLog({
      actorId: currentUser.id,
      action: CourseAction.COURSE_DELETED,
      targetId: id,
      ip,
    });
  },
};
