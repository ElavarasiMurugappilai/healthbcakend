// backend/src/controllers/authController.ts - Fixed version
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ✅ Helper function to generate tokens with proper expiration
const generateToken = (userId: string) => {
  // For development: longer expiration (7 days)
  // For production: shorter expiration (1 day) + refresh token strategy
  const expiresIn = process.env.NODE_ENV === 'production' ? '1d' : '7d';
  
  const token = jwt.sign(
    { id: userId }, 
    JWT_SECRET, 
    { expiresIn }
  );
  
  console.log(`🔑 Generated token for user ${userId}, expires in: ${expiresIn}`);
  return token;
};

// ✅ Signup - Enhanced with proper token generation
export const signup = async (req: Request, res: Response) => {
  try {
    console.log("📝 Signup request:", { email: req.body.email, name: req.body.name });
    
    const { name, email, password, age, gender, medicalInfo } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds

    // Extract conditions and goals from medicalInfo
    const conditions = medicalInfo?.conditions || [];
    const goals = medicalInfo?.goals || [];

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      age: age ? Number(age) : undefined,
      gender,
      conditions,
      goals
    });

    const savedUser = await user.save();
    console.log("✅ User created successfully:", savedUser._id);

    // Generate token immediately after signup
    const token = generateToken(savedUser._id.toString());

    // Return token and user data
    res.status(201).json({ 
      message: "User created successfully",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        age: savedUser.age,
        gender: savedUser.gender,
        conditions: savedUser.conditions,
        goals: savedUser.goals
      }
    });
  } catch (err: any) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ 
      message: "Signup failed", 
      error: err.message || "Unknown error"
    });
  }
};

// ✅ Login - Enhanced with better token management
export const login = async (req: Request, res: Response) => {
  try {
    console.log("🔐 Login request:", { email: req.body.email });
    
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for user:", user._id);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate fresh token
    const token = generateToken(user._id.toString());

    console.log("✅ Login successful for user:", user._id);

    // Return token and user data
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        conditions: user.conditions,
        goals: user.goals,
        avatar: user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
      }
    });
  } catch (err: any) {
    console.error("❌ Login error:", err);
    res.status(500).json({ 
      message: "Login failed", 
      error: err.message || "Unknown error"
    });
  }
};

// ✅ Token refresh endpoint (for future use)
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
    
    // Generate new access token
    const newToken = generateToken(decoded.id);
    
    res.json({ token: newToken });
  } catch (err: any) {
    console.error("❌ Refresh token error:", err);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// ✅ Verify token endpoint (for debugging)
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; exp: number };
    
    // Check if token is close to expiration (within 1 hour)
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - now;
    const needsRefresh = timeUntilExpiry < 3600; // Less than 1 hour

    res.json({
      valid: true,
      userId: decoded.id,
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
      timeUntilExpiry: timeUntilExpiry,
      needsRefresh
    });
  } catch (err: any) {
    res.status(401).json({ 
      valid: false, 
      error: err.message 
    });
  }
};