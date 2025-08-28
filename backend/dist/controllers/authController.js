"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.refreshToken = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const generateToken = (userId) => {
    const expiresIn = process.env.NODE_ENV === 'production' ? '1d' : '7d';
    const token = jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn });
    console.log(`🔑 Generated token for user ${userId}, expires in: ${expiresIn}`);
    return token;
};
const signup = async (req, res) => {
    try {
        console.log("📝 Signup request:", { email: req.body.email, name: req.body.name });
        const { name, email, password, age, gender, medicalInfo } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await userModel_1.default.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const conditions = medicalInfo?.conditions || [];
        const goals = medicalInfo?.goals || [];
        const user = new userModel_1.default({
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
        const token = generateToken(savedUser._id.toString());
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
    }
    catch (err) {
        console.error("❌ Signup error:", err);
        res.status(500).json({
            message: "Signup failed",
            error: err.message || "Unknown error"
        });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        console.log("🔐 Login request:", { email: req.body.email });
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await userModel_1.default.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Invalid password for user:", user._id);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user._id.toString());
        console.log("✅ Login successful for user:", user._id);
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
    }
    catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({
            message: "Login failed",
            error: err.message || "Unknown error"
        });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
        const newToken = generateToken(decoded.id);
        res.json({ token: newToken });
    }
    catch (err) {
        console.error("❌ Refresh token error:", err);
        res.status(401).json({ message: "Invalid refresh token" });
    }
};
exports.refreshToken = refreshToken;
const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decoded.exp - now;
        const needsRefresh = timeUntilExpiry < 3600;
        res.json({
            valid: true,
            userId: decoded.id,
            expiresAt: new Date(decoded.exp * 1000).toISOString(),
            timeUntilExpiry: timeUntilExpiry,
            needsRefresh
        });
    }
    catch (err) {
        res.status(401).json({
            valid: false,
            error: err.message
        });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=authController.js.map