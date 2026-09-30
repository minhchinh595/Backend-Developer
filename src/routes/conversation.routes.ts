import { Router } from "express";

import {
  getConversations,
  getConversation,
} from "../controllers/conversation.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getConversations);

router.get("/:id", authenticate, getConversation);

export default router;