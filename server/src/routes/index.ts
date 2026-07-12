import express from "express";

import healthRoute from "./health.route.js";

const router = express.Router();

router.use(healthRoute);

export default router;
