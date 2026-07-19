import { enrollmentRepository } from "./enrollment.repository.js";
import { courseRepository } from "../courses/course.repository.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../shared/errors/ConflictError.js";
import { AppError } from "../../shared/errors/AppError.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";
import auditService from "../audit/Audit.service.js";
import { EnrollmentAction } from "../../constants/enrollment.constants.js";

export const enrollmentService = {
  // Direct enrollment path — only valid for free (price === 0) courses.
  // Paid courses must go through the payment flow, which calls
  // enrollmentService.grantAfterPayment() internally once payment succeeds.
  enrollFree: async (userId: string, courseId: string, ip?: string) => {
    const course = await courseRepository.findById(courseId);
    if (!course) throw new NotFoundError("Course not found");
    if (!course.published) throw new NotFoundError("Course not found");

    if (course.price > 0) {
      throw new AppError(
        HttpStatusCode.BAD_REQUEST,
        "This course requires payment. Use the checkout flow to enroll.",
      );
    }

    const alreadyEnrolled = await enrollmentRepository.isEnrolled(
      userId,
      courseId,
    );
    if (alreadyEnrolled) {
      throw new ConflictError("You are already enrolled in this course");
    }

    const enrollment = await enrollmentRepository.create(userId, courseId);

    await auditService.recordAuditLog({
      actorId: userId,
      action: EnrollmentAction.ENROLLMENT_MANUALLY_GRANTED,
      targetId: enrollment.id,
      metadata: { courseId },
      ip,
    });

    return enrollment;
  },

  // Called by the payment module after a verified successful payment —
  // not exposed via its own public route.
  grantAfterPayment: async (
    userId: string,
    courseId: string,
    paymentId: string,
  ) => {
    const alreadyEnrolled = await enrollmentRepository.isEnrolled(
      userId,
      courseId,
    );
    if (alreadyEnrolled) return; // idempotent — safe if called twice

    return enrollmentRepository.create(userId, courseId, paymentId);
  },

  isEnrolled: async (userId: string, courseId: string): Promise<boolean> => {
    return enrollmentRepository.isEnrolled(userId, courseId);
  },

  listMyEnrollments: async (userId: string) => {
    const enrollments = await enrollmentRepository.findMyEnrollments(userId);
    return enrollments.map((e) => ({
      id: e.id,
      courseId: e.course.id,
      courseTitle: e.course.title,
      courseThumbnail: e.course.thumbnail,
      enrolledAt: e.enrolledAt,
    }));
  },

  // Instructor sees their own course's enrollments; Admin sees any.
  // Ownership check delegated to the caller (controller), same pattern as courses.
  listCourseEnrollments: async (courseId: string) => {
    const course = await courseRepository.findById(courseId);
    if (!course) throw new NotFoundError("Course not found");

    const enrollments =
      await enrollmentRepository.findCourseEnrollments(courseId);
    return enrollments.map((e) => ({
      id: e.id,
      userId: e.user.id,
      userName: e.user.name,
      userEmail: e.user.email,
      enrolledAt: e.enrolledAt,
    }));
  },
};
