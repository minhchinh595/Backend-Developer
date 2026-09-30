import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import {
  getUserConversations,
  getConversationById,
} from "../services/conversation.service.js";

export async function getConversations(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user!.userId;

    const conversations = await getUserConversations(userId);

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get conversations",
    });
  }
}

export async function getConversation(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user!.userId;
    const conversationId = Number(req.params.id);

    if (!Number.isInteger(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation id",
      });
    }

    const conversation = await getConversationById(
      userId,
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Get conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get conversation",
    });
  }
}