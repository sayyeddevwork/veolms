import { certificateRepository } from "./certificate.repository.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { prisma } from "../../infrastructure/database/prisma.client.js";

export const certificateService = {
  // Called from progress.service.ts after a lesson is marked complete.
  // Idempotent — safe to call repeatedly; only issues once.
  checkAndIssueIfEligible: async (
    userId: string,
    courseId: string,
  ): Promise<void> => {
    const existing = await certificateRepository.findByUserAndCourse(
      userId,
      courseId,
    );
    if (existing) return; // already issued

    const totalLessons = await prisma.lesson.count({
      where: { section: { courseId } },
    });
    if (totalLessons === 0) return;

    const completedCount = await prisma.progress.count({
      where: { userId, completed: true, lesson: { section: { courseId } } },
    });

    if (completedCount >= totalLessons) {
      await certificateRepository.create(userId, courseId);
    }
  },

  listMyCertificates: async (userId: string) => {
    const certs = await certificateRepository.findByUser(userId);
    return certs.map((c) => ({
      id: c.id,
      courseId: c.courseId,
      courseTitle: c.course.title,
      verificationCode: c.verificationCode,
      issuedAt: c.issuedAt,
    }));
  },

  getForDownload: async (certificateId: string, requesterId: string) => {
    const cert = await certificateRepository.findById(certificateId);
    if (!cert || cert.userId !== requesterId) {
      throw new NotFoundError("Certificate not found");
    }
    return {
      studentName: cert.user.name,
      courseTitle: cert.course.title,
      issuedAt: cert.issuedAt,
      verificationCode: cert.verificationCode,
    };
  },

  verify: async (code: string) => {
    const cert = await certificateRepository.findByVerificationCode(code);
    if (!cert) throw new NotFoundError("Certificate not found or invalid");
    return {
      studentName: cert.user.name,
      courseTitle: cert.course.title,
      issuedAt: cert.issuedAt,
      valid: true,
    };
  },
};
