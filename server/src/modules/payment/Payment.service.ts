import { prisma } from "../../infrastructure/database/prisma.client.js";
import { razorpayClient } from "./Razorpay.client .js";
import { paymentRepository } from "./Payment.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import type {
  VerifyPaymentDto,
  RazorpayWebhookPayload,
} from "./Razorpay.types.js";

import { PaymentErrors } from "../../shared/errors/Payment.errors.js";

export const paymentService = {
  async createOrder(userId: string, courseId: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || !course.published) {
      throw PaymentErrors.courseNotFound();
    }

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) {
      throw PaymentErrors.alreadyEnrolled();
    }

    // course.price is stored in rupees; Razorpay expects paise
    const amountInPaise = course.price * 100;

    // Create our own row first so we have an id to use as the Razorpay receipt,
    // then create the order on Razorpay and store its id back on the row.
    const payment = await paymentRepository.create(
      userId,
      courseId,
      amountInPaise,
      `pending-${userId}-${Date.now()}`,
    );
    const order = await razorpayClient.createOrder(
      amountInPaise,
      "INR",
      payment.id,
    );
    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: { razorpayOrderId: order.id },
    });

    return { payment: updated, razorpayOrder: order };
  },

  /**
   * Called from the client's checkout success callback. Verifies the
   * signature and optimistically marks the payment PAID + creates the
   * enrollment. The webhook handler below re-confirms this independently,
   * so a spoofed client call without a valid signature is rejected here,
   * and a client call that never arrives is still caught by the webhook.
   */
  async verifyCheckout(userId: string, dto: VerifyPaymentDto) {
    const isValid = razorpayClient.verifyCheckoutSignature(dto);
    if (!isValid) {
      throw PaymentErrors.invalidSignature();
    }

    const payment = await paymentRepository.findByOrderId(dto.razorpayOrderId);
    if (!payment || payment.userId !== userId) {
      throw PaymentErrors.paymentNotFound();
    }
    if (payment.status === "PAID") {
      return payment; // already reconciled, e.g. by the webhook arriving first
    }

    const { payment: updated } = await paymentRepository.markPaidAndEnroll(
      payment.id,
      payment.userId,
      payment.courseId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );
    return updated;
  },

  /**
   * Source of truth for payment status. Always verify the signature against
   * the RAW request body before calling this — do that in the controller.
   */
  async handleWebhook(event: RazorpayWebhookPayload) {
    const { entity } = event.payload.payment;
    const payment = await paymentRepository.findByOrderId(entity.order_id);
    if (!payment) return; // order not from this system, or already deleted — ignore

    if (event.event === "payment.captured" && payment.status !== "PAID") {
      await paymentRepository.markPaidAndEnroll(
        payment.id,
        payment.userId,
        payment.courseId,
        entity.id,
        "webhook-verified",
      );
    } else if (event.event === "payment.failed") {
      await paymentRepository.markStatus(payment.id, "FAILED", {
        razorpayPaymentId: entity.id,
      });
    }
  },
};
