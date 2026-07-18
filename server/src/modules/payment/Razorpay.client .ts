import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "crypto";
import { config } from "../../config/index.js";
import type { RazorpayOrder, VerifyPaymentDto } from "./Razorpay.types.js";

const razorpayInstance = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export const razorpayClient = {
  /**
   * Creates an order on Razorpay's side. amountInPaise must be an integer
   * (e.g. ₹499.00 -> 49900). receipt should be your own internal Payment id
   * so you can reconcile webhooks/orders later.
   */
  async createOrder(
    amountInPaise: number,
    currency: string,
    receipt: string,
  ): Promise<RazorpayOrder> {
    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
    });
    return order as unknown as RazorpayOrder;
  },

  /**
   * Verifies the signature returned by checkout.js on the client after a
   * successful payment. This does NOT confirm the payment was captured —
   * only that the payload wasn't tampered with. Treat it as "provisionally
   * paid" and let the webhook be the source of truth for final status.
   */
  verifyCheckoutSignature(dto: VerifyPaymentDto): boolean {
    const expected = createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest("hex");
    return safeCompare(expected, dto.razorpaySignature);
  },

  /**
   * Verifies the X-Razorpay-Signature header on incoming webhook requests.
   * `rawBody` MUST be the raw request body bytes/string, not a re-serialized
   * JSON.stringify(req.body) — Razorpay signs the exact bytes it sent.
   */
  verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean {
    const expected = createHmac("sha256", config.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");
    return safeCompare(expected, signatureHeader);
  },
};
