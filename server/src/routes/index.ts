import express from "express";

import healthRoute from "../modules/health/health.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";

const router = express.Router();

router.use(healthRoute);
router.use("/auth", authRoutes);

export default router;
