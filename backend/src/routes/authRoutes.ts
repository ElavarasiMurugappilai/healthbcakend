import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ✅ Test route
router.get("/test", (req: Request, res: Response) => {
  res.json({ message: "Auth routes working!" });
});

// ✅ Signup route
router.post("/signup", async (req: Request, res: Response) => {
  try {
    console.log("📝 Signup request:", req.body);
    
    const { name, email, password, age, gender, medicalInfo, primaryGoal, notes, consent } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email, and password are required" 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userData: any = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      age: age ? Number(age) : undefined,
      gender: gender || undefined,
      conditions: medicalInfo?.conditions || [],
      goals: medicalInfo?.goals || [],
      primaryGoal: primaryGoal || undefined,
      notes: notes || undefined,
      consent: Boolean(consent)
    };

    const user = new User(userData);
    await user.save();

    console.log("✅ User created:", user._id);
    
    res.status(201).json({ 
      message: "User created successfully",
      userId: user._id 
    });

  } catch (error: any) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ 
      message: "Signup failed", 
      error: error.message 
    });
  }
});

// ✅ Login route
router.post("/login", async (req: Request, res: Response) => {
  try {
    console.log("🔐 Login request:", { email: req.body.email });
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id }, 
      JWT_SECRET, 
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful:", user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        conditions: user.conditions,
        goals: user.goals
      }
    });

  } catch (error: any) {
    console.error("❌ Login error:", error);
    res.status(500).json({ 
      message: "Login failed", 
      error: error.message 
    });
  }
});

export default router;