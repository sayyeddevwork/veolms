import express from "express";
import helmet from "helmet";
import cors from "cors";
import { API_BASE_PATH } from "./constants/api.constants.js";
import router from "./routes/index.js";
import { requestLogger } from "./infrastructure/logging/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(requestLogger);
app.use(API_BASE_PATH, router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
