import { Router } from "express";
import { getConversations } from "../controllers/conversation.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getConversations);

export default router;