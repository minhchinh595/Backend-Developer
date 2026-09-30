import { Router } from "express";
import { analyze } from "../controllers/analyze.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { aiRateLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  aiRateLimiter,
  analyze
);

export default router;