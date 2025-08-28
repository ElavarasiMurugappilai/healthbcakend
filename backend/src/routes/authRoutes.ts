// backend/src/routes/authRoutes.ts
import express, { Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { signup, login, refreshToken, verifyToken } from "../controllers/authController";
import User from "../models/userModel";

const router = express.Router();

// Extend Express Request with user
interface AuthRequest extends Request {
  user?: { id: string };
}

// ✅ POST /auth/signup
router.post("/signup", signup);

// ✅ POST /auth/login  
router.post("/login", login);

// ✅ POST /auth/refresh (for future token refresh)
router.post("/refresh", refreshToken);

// ✅ GET /auth/verify (check if token is valid)
router.get("/verify", verifyToken);

// ✅ GET /auth/me (get current user info)
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Retrieved user profile:", req.user.id);

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      conditions: user.conditions,
      goals: user.goals,
      avatar: user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
      createdAt: user.createdAt
    });
  } catch (err: any) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

// ✅ Health check for auth routes
router.get("/health", (_req: Request, res: Response) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    routes: ["/signup", "/login", "/refresh", "/verify", "/me"]
  });
});

export default router;
