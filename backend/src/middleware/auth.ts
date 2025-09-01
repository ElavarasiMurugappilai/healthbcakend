import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Request interface to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
};

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(` Auth middleware: ${req.method} ${req.originalUrl}`);
    console.log(` Headers:`, {
      authorization: req.headers.authorization ? 'present' : 'missing',
      authPreview: req.headers.authorization ? req.headers.authorization.substring(0, 20) + '...' : 'none'
    });
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(` Auth failed: No valid token provided`);
      res.status(401).json({
        success: false,
        message: 'Access denied. No valid token provided.'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Token is empty.'
      });
      return;
    }

    try {
      const decoded = verifyToken(token);
      
      // Fetch user from database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
        return;
      }

      // Skip verification check in development mode
      if (!user.isVerified && process.env.NODE_ENV !== 'development') {
        res.status(401).json({
          success: false,
          message: 'Account not verified. Please verify your email.'
        });
        return;
      }

      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.'
        });
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Token verification failed.'
        });
      }
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// Optional auth middleware - doesn't fail if no token provided
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next(); // Continue without user
    }

    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isVerified) {
        req.user = user;
      }
    } catch (jwtError) {
      // Silently fail for optional auth
      console.log('Optional auth failed:', jwtError.message);
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without user
  }
};

// Admin middleware (for future use)
export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
      return;
    }

    // Check if user has admin role (you can extend User model with roles)
    // For now, we'll use a simple email check
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',');
    
    if (!adminEmails.includes(req.user.email)) {
      res.status(403).json({
        success: false,
        message: 'Admin access required.'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during admin check.'
    });
  }
};
