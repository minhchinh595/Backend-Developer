import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { getUserConversations } from "../services/conversation.service.js";

export async function getConversations(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const conversations = await getUserConversations(
      req.user.userId
    );

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