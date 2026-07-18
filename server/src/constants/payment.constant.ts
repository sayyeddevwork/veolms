export const PaymentAction = {
  COURSE_NOT_FOUND: "Course not found",
  INVALID_PAYMENT_SIGNATURE: "Invalid payment signature",
  ALREADY_ENROLLED: "Already enrolled in this course",
  PAYMENT_NOT_FOUND: "Payment record not found",
} as const;

export type PaymentActionType =
  (typeof PaymentAction)[keyof typeof PaymentAction];
