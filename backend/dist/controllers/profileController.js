"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertQuiz = upsertQuiz;
exports.getMyProfile = getMyProfile;
const UserProfile_1 = __importDefault(require("../models/UserProfile"));
const userModel_1 = __importDefault(require("../models/userModel"));
async function upsertQuiz(req, res) {
    try {
        console.log("🔍 upsertQuiz called with user:", req.user);
        const userId = req.user?.id;
        if (!userId) {
            console.log("❌ No user ID in request");
            return res.status(401).json({ message: "Unauthorized - No user ID" });
        }
        console.log("✅ Processing quiz for user:", userId);
        const body = req.body;
        const profile = await UserProfile_1.default.findOneAndUpdate({ userId }, { $set: body }, { upsert: true, new: true });
        const user = await userModel_1.default.findById(userId).select('-password');
        if (!user) {
            console.log("❌ User not found for ID:", userId);
            return res.status(404).json({ message: "User not found" });
        }
        console.log("✅ Profile saved successfully for user:", userId);
        return res.json({
            message: "Profile saved",
            profile,
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
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error("❌ Error in upsertQuiz:", errorMessage);
        return res.status(500).json({ message: errorMessage || "Error saving profile" });
    }
}
async function getMyProfile(req, res) {
    try {
        console.log("🔍 getMyProfile called with user:", req.user);
        const userId = req.user?.id;
        if (!userId) {
            console.log("❌ No user ID in request");
            return res.status(401).json({ message: "Unauthorized - No user ID" });
        }
        console.log("✅ Fetching profile for user:", userId);
        const profile = await UserProfile_1.default.findOne({ userId });
        console.log("✅ Profile fetched successfully for user:", userId);
        return res.json(profile || null);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error("❌ Error in getMyProfile:", errorMessage);
        return res.status(500).json({ message: errorMessage || "Error fetching profile" });
    }
}
//# sourceMappingURL=profileController.js.map