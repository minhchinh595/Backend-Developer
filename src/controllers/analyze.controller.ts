import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { analyzeWithAI } from "../services/structured-ai.service.js";

export async function analyze(
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

    const result = await analyzeWithAI(message);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("AI analyze error:", error);

    return res.status(500).json({
      success: false,
      message: "AI structured output request failed",
    });
  }
}