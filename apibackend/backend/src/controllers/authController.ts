import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ✅ Signup - Fixed to handle medicalInfo structure
export const signup = async (req: Request, res: Response) => {
  try {
    console.log("Signup request body:", req.body); // Debug log
    
    const { name, email, password, age, gender, medicalInfo } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Extract conditions and goals from medicalInfo
    const conditions = medicalInfo?.conditions || [];
    const goals = medicalInfo?.goals || [];

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      age: age ? Number(age) : undefined,
      gender,
      conditions,
      goals
    });

    await user.save();
    console.log("User created successfully:", user._id);

    res.status(201).json({ message: "User created successfully" });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).json({ 
      message: "Signup failed", 
      error: err.message || "Unknown error"
    });
  }
};

// ✅ Login - Enhanced error handling
export const login = async (req: Request, res: Response) => {
  try {
    console.log("Login request body:", req.body); // Debug log
    
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    console.log("Login successful for user:", user._id);

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
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ 
      message: "Login failed", 
      error: err.message || "Unknown error"
    });
  }
};