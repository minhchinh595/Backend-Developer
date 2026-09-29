import { Router } from "express";
import {
  authenticate,
  AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/profile",
  authenticate,
  (req: AuthRequest, res) => {
    res.json({
      success: true,
      message: "You are authenticated",
      user: req.user,
    });
  }
);

export default router;