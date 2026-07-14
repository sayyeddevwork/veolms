import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import authService from "./auth.service.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";
import { Messages } from "../../constants/messages.js";
import { config } from "../../config/index.js";
import { logSecurityEvent } from "../../infrastructure/logging/index.js";
import { AppError } from "../../shared/errors/AppError.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const device = {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  };
  const result = await authService.register(req.body, device);

  res.cookie("accessToken", result.accessToken, config.app.cookies.accessToken);
  res.cookie(
    "refreshToken",
    result.refreshToken,
    config.app.cookies.refreshToken,
  );

  sendSuccess(
    res,
    req.requestId,
    HttpStatusCode.CREATED,
    "Registered successfully",
    {
      user: result.user,
    },
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const device = {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };
    const result = await authService.login(req.body, device);

    res.cookie(
      "accessToken",
      result.accessToken,
      config.app.cookies.accessToken,
    );
    res.cookie(
      "refreshToken",
      result.refreshToken,
      config.app.cookies.refreshToken,
    );

    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Logged in successfully",
      {
        user: result.user,
      },
    );
  } catch (err) {
    logSecurityEvent({
      event: "failed_login",
      email: req.body.email,
      ip: req.ip ?? "unknown",
    });
    throw err;
  }
});
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const rawRefreshToken = req.cookies?.refreshToken;
  if (!rawRefreshToken) {
    throw new AppError(HttpStatusCode.UNAUTHORIZED, "Refresh token missing");
  }

  const device = {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  };

  const result = await authService.refreshSession(rawRefreshToken, device);

  res.cookie("accessToken", result.accessToken, config.app.cookies.accessToken);
  res.cookie(
    "refreshToken",
    result.refreshToken,
    config.app.cookies.refreshToken,
  );

  sendSuccess(res, req.requestId, HttpStatusCode.OK, "Session refreshed");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });
  sendSuccess(res, req.requestId, HttpStatusCode.OK, "Logged out successfully");
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const profile = await authService.getProfile(req.user!.id);
  sendSuccess(res, req.requestId, HttpStatusCode.OK, "Profile fetched", {
    user: profile,
  });
});
export const getSessions = asyncHandler(async (req: Request, res: Response) => {
  const sessions = await authService.listSessions(req.user!.id);

  const formatted = sessions.map((session) => ({
    id: session.id,
    device: session.userAgent ?? "Unknown device",
    ipAddress: session.ip ?? "Unknown",
    lastActive: session.createdAt,
    expiresAt: session.expiresAt,
    current: session.id === req.sessionId,
  }));

  sendSuccess(res, req.requestId, HttpStatusCode.OK, "Sessions fetched", {
    sessions: formatted,
  });
});

export const deleteSession = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    await authService.revokeSession(req.user!.id, sessionId);
    sendSuccess(res, req.requestId, HttpStatusCode.OK, "Session revoked");
  },
);
