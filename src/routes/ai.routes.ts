import { Router } from "express";
import { chat } from "../controllers/ai.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/chat", authenticate, chat);

export default router;