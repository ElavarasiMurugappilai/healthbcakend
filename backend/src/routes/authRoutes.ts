import { Router } from "express";
import { signup, login } from "../controllers/authController";
import User from "../models/userModel";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

// profile of the logged-in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
