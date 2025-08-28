"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectLite = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
const protectLite = async (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = { id: decoded.id };
        console.log("✅ Token verified successfully for user:", decoded.id);
        console.log("✅ User attached to request:", req.user);
        return next();
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error("❌ Token verification error:", errorMessage);
        if (err instanceof Error) {
            if (err.name === 'TokenExpiredError') {
                console.log("❌ Token expired for request:", req.originalUrl);
                return res.status(401).json({ message: "Token expired" });
            }
            else if (err.name === 'JsonWebTokenError') {
                console.log("❌ Invalid JWT token for request:", req.originalUrl);
                return res.status(401).json({ message: "Invalid token" });
            }
        }
        console.log("❌ Unknown token error for request:", req.originalUrl);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};
exports.protectLite = protectLite;
exports.default = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map