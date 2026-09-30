import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { chatWithAI } from "../services/ai.service.js";

export async function chat(
  req: AuthRequest,
  res: Response
) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await chatWithAI(
      req.user.userId,
      message
    );

    return res.status(200).json({
      success: true,
      data: {
        conversationId: result.conversationId,
        message: result.content,
        model: result.model,
        usage: result.usage,
        latencyMs: result.latencyMs,
      },
    });
  } catch (error) {
    console.error("AI chat error:", error);

    return res.status(500).json({
      success: false,
      message: "AI provider request failed",
    });
  }
}