import express from "express";

import healthRoute from "../modules/health/health.routes.js";

const router = express.Router();

router.use(healthRoute);

export default router;
