import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import { baseLogger } from "./pino.instance.js";
import { pinoHttp } from "pino-http";

export const requestLogger = pinoHttp({
  logger: baseLogger,
  genReqId: (req: Request, res: Response) => {
    const existing = req.headers["x-request-id"];
    const id = (existing as string) ?? randomUUID();
    res.setHeader("x-request-id", id);
    return id;
  },
  customLogLevel: (req: Request, res: Response, err: Error | undefined) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req: Request, res: Response) =>
    `${req.method} ${req.url} ${res.statusCode}`,
  customErrorMessage: (req: Request, res: Response, err: Error) =>
    `${req.method} ${req.url} ${res.statusCode} - ${err.message}`,
  customProps: (req: Request) => ({
    requestId: req.id,
  }),
  serializers: {
    req: (req: Request) => ({ method: req.method, url: req.url }),
    res: (res: Response) => ({ statusCode: res.statusCode }),
  },
});
