import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Welcome to VEOLMS System" });
});

export default app;
