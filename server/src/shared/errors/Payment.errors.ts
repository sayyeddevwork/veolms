import { AppError } from "../errors/AppError.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";
import {
  PaymentAction,
  PaymentActionType,
} from "../../constants/payment.constant.js";
export const PaymentErrors = {
  courseNotFound: () =>
    new AppError(
      HttpStatusCode.NOT_FOUND,

      PaymentAction.COURSE_NOT_FOUND,
    ),
  alreadyEnrolled: () =>
    new AppError(
      HttpStatusCode.CONFLICT,

      PaymentAction.ALREADY_ENROLLED,
    ),
  invalidSignature: () =>
    new AppError(
      HttpStatusCode.BAD_REQUEST,

      PaymentAction.INVALID_PAYMENT_SIGNATURE,
    ),
  paymentNotFound: () =>
    new AppError(
      HttpStatusCode.NOT_FOUND,

      PaymentAction.PAYMENT_NOT_FOUND,
    ),
};
