import { Router } from "express";
import {
  getMyCertificates,
  downloadCertificate,
  verifyCertificate,
} from "./certificate.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

router.get("/me", authenticate, getMyCertificates);
router.get("/:id/download", authenticate, downloadCertificate);
router.get("/verify/:code", verifyCertificate); // public — anyone can verify

export default router;
