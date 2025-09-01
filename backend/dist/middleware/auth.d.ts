import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
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
export declare const generateToken: (userId: string, email: string) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuthMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const adminMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=auth.d.ts.map