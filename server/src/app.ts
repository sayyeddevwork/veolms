import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { API_BASE_PATH } from "./constants/api.constants";
import router from "./routes/index.js";
import { config } from "./config";

const app = express();

app.use(helmet());
app.use(cors());
app.use(API_BASE_PATH, router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
