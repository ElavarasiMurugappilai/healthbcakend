"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const MedicationSuggestion_1 = __importDefault(require("../models/MedicationSuggestion"));
const MedicationSchedule_1 = __importDefault(require("../models/MedicationSchedule"));
const MedicationLog_1 = __importDefault(require("../models/MedicationLog"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
const router = express_1.default.Router();
router.post("/:doctorId/suggest-medication", auth_1.authenticateToken, async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { medicationName, dosage, frequency, duration } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const doctor = await Doctor_1.default.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }
        const suggestion = new MedicationSuggestion_1.default({
            userId,
            doctorId,
            medicationName,
            dosage,
            frequency,
            duration,
            status: 'pending'
        });
        await suggestion.save();
        await suggestion.populate('doctorId', 'name specialization');
        res.json({
            success: true,
            message: "Medication suggestion created successfully",
            data: suggestion
        });
    }
    catch (error) {
        console.error("Error creating medication suggestion:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
router.get("/suggestions", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const suggestions = await MedicationSuggestion_1.default.find({ userId })
            .populate('doctorId', 'name specialization photo')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: suggestions
        });
    }
    catch (error) {
        console.error("Error fetching medication suggestions:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
router.patch("/suggestions/:id/accept", auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const suggestion = await MedicationSuggestion_1.default.findOneAndUpdate({ _id: id, userId, status: 'pending' }, {
            status: 'accepted',
            respondedAt: new Date()
        }, { new: true }).populate('doctorId', 'name specialization');
        if (!suggestion) {
            return res.status(404).json({
                success: false,
                message: "Suggestion not found or already processed"
            });
        }
        const schedule = new MedicationSchedule_1.default({
            userId,
            medicationName: suggestion.medicationName,
            dosage: suggestion.dosage,
            frequency: suggestion.frequency,
            scheduleTime: "08:00",
            source: 'doctor-suggestion',
            suggestionId: suggestion._id,
            isActive: true
        });
        await schedule.save();
        const logEntry = new MedicationLog_1.default({
            userId,
            medicationId: schedule._id,
            scheduledTime: new Date(),
            status: 'accepted',
            notes: `Accepted medication suggestion from Dr. ${suggestion.doctorId.name}`
        });
        await logEntry.save();
        res.json({
            success: true,
            message: "Medication added to your schedule",
            data: {
                suggestion,
                schedule,
                logEntry
            }
        });
    }
    catch (error) {
        console.error("Error accepting medication suggestion:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
router.patch("/suggestions/:id/reject", auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const suggestion = await MedicationSuggestion_1.default.findOneAndUpdate({ _id: id, userId, status: 'pending' }, {
            status: 'rejected',
            respondedAt: new Date()
        }, { new: true }).populate('doctorId', 'name specialization');
        if (!suggestion) {
            return res.status(404).json({
                success: false,
                message: "Suggestion not found or already processed"
            });
        }
        const logEntry = new MedicationLog_1.default({
            userId,
            medicationId: suggestion._id,
            scheduledTime: new Date(),
            status: 'rejected',
            notes: reason || `Rejected medication suggestion from Dr. ${suggestion.doctorId.name}`
        });
        await logEntry.save();
        res.json({
            success: true,
            message: `You rejected Dr. ${suggestion.doctorId.name}'s medication suggestion`,
            data: {
                suggestion,
                logEntry
            }
        });
    }
    catch (error) {
        console.error("Error rejecting medication suggestion:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=medicationSuggestions.js.map