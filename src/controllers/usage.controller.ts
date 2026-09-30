import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { getUserUsage } from "../services/usage.service.js";

export async function getUsage(
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

    const usage = await getUserUsage(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      data: usage,
    });
  } catch (error) {
    console.error("Get usage error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get usage",
    });
  }
}