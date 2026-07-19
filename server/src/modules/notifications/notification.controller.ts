import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { notificationService } from "./notification.service.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export const getMyNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await notificationService.listForUser(req.user!.id);
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Notifications fetched",
      result,
    );
  },
);

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAsRead(req.params.id as string, req.user!.id);
  sendSuccess(
    res,
    req.requestId,
    HttpStatusCode.OK,
    "Notification marked as read",
  );
});

export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    await notificationService.markAllAsRead(req.user!.id);
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "All notifications marked as read",
    );
  },
);
