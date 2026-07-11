import express, { Request, Response } from "express";
import { HttpStatusCode } from "../constants/httpStatusCodes.js";
import { sendSuccess } from "../utils/apiResponse.js";

const router = express.Router();

router.get("/health", (req: Request, res: Response) => {
  const uptimeSeconds = process.uptime();

  sendSuccess(res, HttpStatusCode.OK, "Server is healthy", {
    status: "UP",
    version: process.env.npm_package_version ?? "1.0.0",
    uptime: uptimeSeconds,
  });
});

export default router;
