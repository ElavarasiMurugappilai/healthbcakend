"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertQuiz = upsertQuiz;
exports.getMyProfile = getMyProfile;
const UserProfile_1 = __importDefault(require("../models/UserProfile"));
const userModel_1 = __importDefault(require("../models/userModel"));
const CareTeam_1 = __importDefault(require("../models/CareTeam"));
const Medication_1 = __importDefault(require("../models/Medication"));
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
        const cleanedProfileData = { ...profile.toObject() };
        if (cleanedProfileData.gender === '') {
            delete cleanedProfileData.gender;
        }
        const updatedUser = await userModel_1.default.findByIdAndUpdate(userId, {
            profile: {
                ...cleanedProfileData
            }
        }, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            console.log("❌ User not found for ID:", userId);
            return res.status(404).json({ message: "User not found" });
        }
        console.log("✅ Profile saved successfully for user:", userId);
        return res.json({
            message: "Profile saved",
            profile,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isVerified: updatedUser.isVerified,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
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
        const user = await userModel_1.default.findById(userId).select('-password');
        if (!user) {
            console.log("❌ User not found for ID:", userId);
            return res.status(404).json({ message: "User not found" });
        }
        const careTeamMembers = await CareTeam_1.default.find({ userId }).populate('doctorId');
        const careTeam = careTeamMembers.map(member => ({
            name: member.doctorId?.name || member.doctorData?.name || 'Unknown Doctor',
            role: member.doctorId?.specialization || member.doctorData?.specialization || 'Doctor',
            img: member.doctorId?.profilePhoto || '',
            messages: []
        }));
        const userMedications = await Medication_1.default.find({ userId, status: 'accepted' }).populate('doctorId');
        const medications = userMedications.map(med => ({
            name: med.name,
            dosage: med.dosage,
            status: 'Upcoming',
            time: '08:00',
            qty: '1'
        }));
        const enrichedProfile = {
            ...profile?.toObject(),
            careTeam,
            medications,
            trackGlucose: profile?.trackGlucose || false,
            takeMeds: medications.length > 0
        };
        console.log("✅ Profile fetched successfully for user:", userId);
        return res.json({
            profile: enrichedProfile,
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
        console.error("❌ Error in getMyProfile:", errorMessage);
        return res.status(500).json({ message: errorMessage || "Error fetching profile" });
    }
}
//# sourceMappingURL=profileController.js.map