import { prisma } from "../../infrastructure/database/prisma.client.js";
import type { PaymentStatus } from "@prisma/client";

export const paymentRepository = {
  create(
    userId: string,
    courseId: string,
    amount: number,
    razorpayOrderId: string,
  ) {
    return prisma.payment.create({
      data: { userId, courseId, amount, razorpayOrderId, status: "CREATED" },
    });
  },

  findByOrderId(razorpayOrderId: string) {
    return prisma.payment.findUnique({ where: { razorpayOrderId } });
  },

  markStatus(
    id: string,
    status: PaymentStatus,
    fields: { razorpayPaymentId?: string; razorpaySignature?: string } = {},
  ) {
    return prisma.payment.update({
      where: { id },
      data: { status, ...fields },
    });
  },

  /** Enrollment + payment update happen together so a course is never "paid but not enrolled". */
  markPaidAndEnroll(
    paymentId: string,
    userId: string,
    courseId: string,
    razorpayPaymentId: string,
    signature: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "PAID",
          razorpayPaymentId,
          razorpaySignature: signature,
        },
      });

      const enrollment = await tx.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId, paymentId },
        update: { paymentId },
      });

      return { payment, enrollment };
    });
  },
};
