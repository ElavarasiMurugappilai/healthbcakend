import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Fixed protectLite middleware with proper error handling
export const protectLite = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // Attach user info to request
    req.user = { id: decoded.id };
    
    console.log("✅ Token verified for user:", decoded.id);
    
    return next();
  } catch (err: any) {
    console.error("❌ Token verification error:", err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
};

export default authMiddleware;