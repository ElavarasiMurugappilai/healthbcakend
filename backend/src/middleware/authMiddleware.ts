import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Standardize JWT secret usage across the app
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Fixed protectLite middleware with proper error handling
export const protectLite = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    console.log("🔐 protectLite middleware called for:", req.originalUrl);
    console.log("🔐 Headers:", {
      authorization: req.headers.authorization ? "Bearer [TOKEN]" : "No auth header",
      contentType: req.headers["content-type"],
      userAgent: req.headers["user-agent"]
    });

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Invalid or missing authorization header");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      console.log("❌ No token found in authorization header");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    console.log("🔐 Token extracted, length:", token.length);

    // Verify token using standardized JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Attach user info to request
    req.user = { id: decoded.id };
    
    console.log("✅ Token verified successfully for user:", decoded.id);
    console.log("✅ User attached to request:", req.user);
    
    return next();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error("❌ Token verification error:", errorMessage);
    
    if (err instanceof Error) {
      if (err.name === 'TokenExpiredError') {
        console.log("❌ Token expired for request:", req.originalUrl);
        return res.status(401).json({ message: "Token expired" });
      } else if (err.name === 'JsonWebTokenError') {
        console.log("❌ Invalid JWT token for request:", req.originalUrl);
        return res.status(401).json({ message: "Invalid token" });
      }
    }
    
    console.log("❌ Unknown token error for request:", req.originalUrl);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default authMiddleware;