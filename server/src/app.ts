import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { metricsMiddleware } from "./middleware/metrics.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import { API_BASE_PATH } from "./constants/api.constants.js";
import router from "./routes/index.js";
import { requestLogger } from "./infrastructure/logging/index.js";
import { generalRateLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(requestIdMiddleware);
app.use(metricsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generalRateLimiter);
app.use(requestLogger);
app.use(API_BASE_PATH, router);

app.use(notFoundHandler);

// error handler always last
app.use(globalErrorHandler);
export default app;
