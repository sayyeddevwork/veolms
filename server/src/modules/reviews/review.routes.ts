import { Router } from "express";
import {
  createReview,
  listReviews,
  updateReview,
  deleteReview,
} from "./review.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import {
  createReviewSchema,
  updateReviewSchema,
  reviewParamSchema,
  courseIdParamSchema,
} from "./review.schema.js";

const router = Router({ mergeParams: true });

router.get("/", validate(courseIdParamSchema), listReviews);
router.post("/", authenticate, validate(createReviewSchema), createReview);
router.patch(
  "/:reviewId",
  authenticate,
  validate(updateReviewSchema),
  updateReview,
);
router.delete(
  "/:reviewId",
  authenticate,
  validate(reviewParamSchema),
  deleteReview,
);

export default router;
