"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const authController_1 = require("../controllers/authController");
const userModel_1 = __importDefault(require("../models/userModel"));
const router = express_1.default.Router();
router.post("/signup", authController_1.signup);
router.post("/login", authController_1.login);
router.post("/refresh", authController_1.refreshToken);
router.get("/verify", authController_1.verifyToken);
router.get("/me", authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const user = await userModel_1.default.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("✅ Retrieved user profile:", req.user.id);
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
            conditions: user.conditions,
            goals: user.goals,
            avatar: user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
            createdAt: user.createdAt
        });
    }
    catch (err) {
        console.error("❌ Error fetching user:", err);
        res.status(500).json({ message: "Error fetching user profile" });
    }
});
router.get("/health", (_req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        routes: ["/signup", "/login", "/refresh", "/verify", "/me"]
    });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map