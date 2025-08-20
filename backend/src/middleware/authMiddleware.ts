import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    (req as any).userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
