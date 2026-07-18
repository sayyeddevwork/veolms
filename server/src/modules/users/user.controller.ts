import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { userService } from "./user.service.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getById(req.user!.id);
  sendSuccess(
    res,
    req.requestId,

    HttpStatusCode.OK,
    "Profile fetched",
    { user },
  );
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateProfile(req.user!.id, req.body);
  sendSuccess(
    res,
    req.requestId,

    HttpStatusCode.OK,
    "Profile updated successfully",
    { user },
  );
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.listAll();
  sendSuccess(res, req.requestId, HttpStatusCode.OK, "Users fetched", {
    users,
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getById(req.params.id as string);
  sendSuccess(res, req.requestId, HttpStatusCode.OK, "User fetched", {
    user,
  });
});

export const changeUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.changeRole(
      req.params.id as string,
      req.body.role,
      req.user!.id,
      req.ip,
    );
    sendSuccess(
      res,
      req.requestId,

      HttpStatusCode.OK,
      "User role updated successfully",
      { user },
    );
  },
);
