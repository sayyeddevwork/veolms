export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface Enrollment {
  id: string;
  courseId: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
}
