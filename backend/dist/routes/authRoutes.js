"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const router = express_1.default.Router();
router.post('/register', validation_1.registerValidation, validation_1.handleValidationErrors, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const user = new User_1.default({
            email,
            password,
            name,
            verificationToken,
            isVerified: process.env.NODE_ENV === 'development'
        });
        await user.save();
        const token = (0, auth_2.generateToken)(user._id.toString(), user.email);
        console.log(`✅ User registered: ${email}`);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.getPublicProfile(),
                token,
                ...(process.env.NODE_ENV === 'development' && {
                    verificationToken
                })
            }
        });
    }
    catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.post('/login', validation_1.loginValidation, validation_1.handleValidationErrors, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: 'Please verify your email before logging in',
                requiresVerification: true
            });
        }
        const token = (0, auth_2.generateToken)(user._id.toString(), user.email);
        console.log(`✅ User logged in: ${email}`);
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.getPublicProfile(),
                token
            }
        });
    }
    catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.get('/verify', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        res.json({
            success: true,
            message: 'Token is valid',
            data: {
                user: req.user.getPublicProfile()
            }
        });
    }
    catch (error) {
        console.error('❌ Token verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying token',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required'
            });
        }
        const user = await User_1.default.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        console.log(`✅ Email verified for user: ${user.email}`);
        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    }
    catch (error) {
        console.error('❌ Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying email',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: {
                user: req.user.getPublicProfile()
            }
        });
    }
    catch (error) {
        console.error('❌ Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Auth service is healthy',
        timestamp: new Date().toISOString(),
        endpoints: [
            'POST /auth/register',
            'POST /auth/login',
            'GET /auth/verify',
            'POST /auth/verify-email',
            'GET /auth/me'
        ]
    });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map