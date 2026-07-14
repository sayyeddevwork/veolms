import { Request, Response, NextFunction } from "express";
import {
  httpRequestDuration,
  httpRequestTotal,
} from "../infrastructure/monitoring/metrics.js";

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds + nanoseconds / 1e9;
    const route = req.route?.path ?? req.path;

    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode },
      duration,
    );
    httpRequestTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
  });

  next();
};
