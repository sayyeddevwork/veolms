/** Minimal shape of a Razorpay order — only the fields we actually use. */
export interface RazorpayOrder {
  id: string;
  amount: number; // in paise
  currency: string;
  status: string;
  receipt?: string | null;
}

/** Sent by the client after checkout.js completes, to be verified server-side. */
export interface VerifyPaymentDto {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface CreateOrderDto {
  courseId: string;
}

/** Subset of Razorpay webhook payload for payment.captured / payment.failed events. */
export interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        status: string;
        amount: number;
        currency: string;
      };
    };
  };
}
