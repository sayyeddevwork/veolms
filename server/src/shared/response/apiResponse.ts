import { Response } from "express";

export interface ErrorDetail {
  field?: string;
  message: string;
}

interface ApiSuccessBody<T = unknown> {
  success: true;
  message: string;
  requestId: string;
  data: T;
}

interface ApiErrorBody<T = unknown> {
  success: false;
  message: string;
  requestId: string;
  errors: ErrorDetail[];
  data?: T;
}

export const sendSuccess = <T>(
  res: Response,
  requestId: string,
  statusCode: number,
  message: string,
  data: T = {} as T,
) => {
  const body: ApiSuccessBody<T> = {
    success: true,
    message,
    requestId,
    data,
  };
  return res.status(statusCode).json(body);
};

export const sendError = <T = undefined>(
  res: Response,
  requestId: string,
  statusCode: number,
  message: string,
  errors: ErrorDetail[] = [],
  data?: T,
) => {
  const body: ApiErrorBody<T> = {
    success: false,
    message,
    requestId,
    errors,
    ...(data !== undefined ? { data } : {}),
  };
  return res.status(statusCode).json(body);
};
