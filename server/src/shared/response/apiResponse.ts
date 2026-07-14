import { Response } from "express";
export interface ErrorDetail {
  field?: string;
  message: string;
}
interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  errors: ErrorDetail[];
  requestId: string;
  data?: T;
}

export const sendSuccess = <T>(
  res: Response,
  requestId: string,
  statusCode: number,
  message: string,
  data: T = {} as T,
) => {
  const body: ApiResponseBody<T> = {
    success: true,
    message,
    errors: [],
    requestId,
    ...(data !== undefined ? { data } : {}),
  };
  return res.status(statusCode).json(body);
};

export const sendError = <T = undefined>(
  res: Response,
  requestId: string,
  statusCode: number,
  message: string,
  errors: ErrorDetail[] = [],
  data: T = {} as T,
) => {
  const body: ApiResponseBody<T> = {
    success: false,
    message,
    errors,
    requestId,
    ...(data !== undefined ? { data } : {}),
  };
  return res.status(statusCode).json(body);
};
