import express from "express";

import healthRoute from "./health.route.js";
import { API_BASE_PATH } from "../constants/api.constants.js";

const router = express.Router();

router.use(healthRoute);

export default router;
