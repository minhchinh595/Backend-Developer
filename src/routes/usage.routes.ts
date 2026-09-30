import { Router } from "express";
import { getUsage } from "../controllers/usage.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getUsage);

export default router;