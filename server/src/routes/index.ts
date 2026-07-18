import express from "express";

import healthRoute from "../modules/health/health.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import courseRoutes from "../modules/courses/course.routes.js";
import userRoutes from "../modules/users/user.routes.js";

const router = express.Router();

router.use(healthRoute);
router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/users", userRoutes);

export default router;
