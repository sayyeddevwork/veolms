import express from "express";

import healthRoute from "../modules/health/health.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import courseRoutes from "../modules/courses/course.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import auditRoutes from "../modules/audit/Audit.routes.js";
import enrollmentRoutes from "../modules/enrollments/enrollment.routes.js";
import sectionRoutes from "../modules/sections/section.routes.js";
import lessonRoutes from "../modules/lessons/lesson.routes.js";
import progressRoutes from "../modules/progress/progress.routes.js";
import certificateRoutes from "../modules/certificates/certificate.routes.js";
import reviewRoutes from "../modules/reviews/review.routes.js";
import notificationRoutes from "../modules/notifications/notification.routes.js";
import analyticsRoutes from "../modules/analytics/analytics.routes.js";
import searchRoutes from "../modules/search/search.routes.js";

const router = express.Router();

router.use(healthRoute);
router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/users", userRoutes);
router.use("/audit", auditRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/:courseId/sections", sectionRoutes);
router.use("/:sectionId/lessons", lessonRoutes);
router.use("/progress", progressRoutes);
router.use("/certificates", certificateRoutes);
router.use("/:courseId/reviews", reviewRoutes);
router.use("/notifications", notificationRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/search", searchRoutes);

export default router;
