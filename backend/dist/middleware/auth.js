"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.optionalAuthMiddleware = exports.authenticateToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (userId, email) => {
    return jsonwebtoken_1.default.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.verifyToken = verifyToken;
const authenticateToken = async (req, res, next) => {
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
        const token = authHeader.substring(7);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. Token is empty.'
            });
            return;
        }
        try {
            const decoded = (0, exports.verifyToken)(token);
            const user = await User_1.default.findById(decoded.userId).select('-password');
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid token. User not found.'
                });
                return;
            }
            if (!user.isVerified && process.env.NODE_ENV !== 'development') {
                res.status(401).json({
                    success: false,
                    message: 'Account not verified. Please verify your email.'
                });
                return;
            }
            req.user = user;
            next();
        }
        catch (jwtError) {
            if (jwtError instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(401).json({
                    success: false,
                    message: 'Token expired. Please login again.'
                });
            }
            else if (jwtError instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid token. Please login again.'
                });
            }
            else {
                res.status(401).json({
                    success: false,
                    message: 'Token verification failed.'
                });
            }
            return;
        }
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.'
        });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.substring(7);
        if (!token) {
            return next();
        }
        try {
            const decoded = (0, exports.verifyToken)(token);
            const user = await User_1.default.findById(decoded.userId).select('-password');
            if (user && user.isVerified) {
                req.user = user;
            }
        }
        catch (jwtError) {
            console.log('Optional auth failed:', jwtError.message);
        }
        next();
    }
    catch (error) {
        console.error('Optional auth middleware error:', error);
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
            return;
        }
        const adminEmails = (process.env.ADMIN_EMAILS || '').split(',');
        if (!adminEmails.includes(req.user.email)) {
            res.status(403).json({
                success: false,
                message: 'Admin access required.'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during admin check.'
        });
    }
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=auth.js.map