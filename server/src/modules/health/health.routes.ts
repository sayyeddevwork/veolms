import { Router } from "express";
import { getLiveness, getReadiness, getMetrics } from "./health.controller.js";

const router = Router();

router.get("/health", getLiveness);
router.get("/ready", getReadiness);

router.get("/metrics", getMetrics);

export default router;
