import type { Request, Response, NextFunction } from "express";
import { paymentService } from "./Payment.service.js";
import { razorpayClient } from "./Razorpay.client .js";
import type {
  CreateOrderDto,
  VerifyPaymentDto,
  RazorpayWebhookPayload,
} from "./Razorpay.types.js";

export const paymentController = {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body as CreateOrderDto;
      const userId = req.user!.id; // set by requireAuth middleware
      const result = await paymentService.createOrder(userId, courseId);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as VerifyPaymentDto;
      const userId = req.user!.id;
      const payment = await paymentService.verifyCheckout(userId, dto);
      res.json({ payment });
    } catch (err) {
      next(err);
    }
  },

  /**
   * IMPORTANT: this route must be mounted with express.raw({ type: "application/json" })
   * (not express.json()) so req.body is the raw Buffer/string Razorpay signed.
   * Wire that up in payment.routes.ts, and make sure it's applied BEFORE any
   * global express.json() middleware for this specific path.
   */
  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.header("X-Razorpay-Signature");
      const rawBody = req.body as Buffer;

      if (
        !signature ||
        !razorpayClient.verifyWebhookSignature(
          rawBody.toString("utf8"),
          signature,
        )
      ) {
        return res.status(400).json({ error: "Invalid webhook signature" });
      }

      const event = JSON.parse(
        rawBody.toString("utf8"),
      ) as RazorpayWebhookPayload;
      await paymentService.handleWebhook(event);
      res.status(200).json({ received: true });
    } catch (err) {
      next(err);
    }
  },
};

// Uses the shared AppError -> your existing global error middleware (from the
// auth module) already handles `err instanceof AppError` and responds with
// { error: err.message, code: err.code } at err.statusCode — no extra wiring needed.
