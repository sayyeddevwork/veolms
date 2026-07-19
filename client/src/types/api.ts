export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  requestId: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  requestId: string;
  errors: unknown[];
}
