import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { signup, login } from "../controllers/authController";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// POST /auth/signup
router.post("/signup", signup);

// POST /auth/login
router.post("/login", login);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(400).json({ message: "User not found" });

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 3. Create token payload
    const tokenUser = { id: foundUser._id, email: foundUser.email };

    // 4. Sign JWT
    const token = jwt.sign(tokenUser, process.env.JWT_SECRET!, { expiresIn: "1d" });

    // 5. Send token + user
    res.json({ token, user: foundUser });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /auth/me (protected) - Get current user info
router.get("/me", authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        conditions: user.conditions,
        goals: user.goals,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (err: any) {
    console.error("Error in /auth/me:", err);
    res.status(500).json({ message: "Error fetching user data" });
  }

});

export default router;