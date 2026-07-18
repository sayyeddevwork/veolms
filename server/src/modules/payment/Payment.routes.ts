import { Router, raw } from "express";
import { paymentController } from "./Payment.controller.js";
import { requireAuth } from "../../middleware/authenticate.js";

const router = Router();

// Webhook must receive the raw body for signature verification — register
// this BEFORE app.use(express.json()) is applied globally, or scope it here
// with express.raw() as shown so it overrides the global parser for this path.
router.post(
  "/webhook",
  raw({ type: "application/json" }),
  paymentController.webhook,
);

router.post("/orders", requireAuth, paymentController.createOrder);
router.post("/verify", requireAuth, paymentController.verify);

export default router;
