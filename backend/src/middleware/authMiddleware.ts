import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ✅ Extended Request interface for TypeScript
export interface AuthRequest extends Request {
  user?: any;
  userId?: string; // For backward compatibility with existing routes
}

// ✅ Main protect middleware (your current version - improved)
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // Optional: Verify user still exists in database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Set both user object and userId for flexibility
    req.user = user;
    req.userId = decoded.id;
    
    next();
  } catch (err: any) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ message: "Token invalid" });
  }
};

// ✅ Backward compatibility - alias for existing routes
export const authMiddleware = protect;

// ✅ Optional: Middleware that doesn't require database lookup (faster)
export const protectLite = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.userId = decoded.id;
    
    next();
  } catch (err: any) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ message: "Token invalid" });
  }
};