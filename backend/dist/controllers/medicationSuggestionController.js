"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedicationSchedule = exports.acceptMedicationSuggestion = exports.getMedicationSuggestions = exports.suggestMedication = void 0;
const MedicationSuggestion_1 = __importDefault(require("../models/MedicationSuggestion"));
const MedicationSchedule_1 = __importDefault(require("../models/MedicationSchedule"));
const mongoose_1 = __importDefault(require("mongoose"));
const suggestMedication = async (req, res) => {
    try {
        const { userId, medicationName, dosage, instructions } = req.body;
        const doctorId = req.user?._id;
        if (!userId || !medicationName || !dosage || !instructions) {
            return res.status(400).json({
                error: "userId, medicationName, dosage, and instructions are required"
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ error: "Invalid user or doctor ID" });
        }
        console.log(`📝 Doctor ${doctorId} suggesting medication ${medicationName} to user ${userId}`);
        const suggestion = new MedicationSuggestion_1.default({
            userId,
            doctorId,
            medicationName,
            dosage,
            instructions,
            accepted: false
        });
        await suggestion.save();
        const populatedSuggestion = await MedicationSuggestion_1.default.findById(suggestion._id)
            .populate("doctorId", "name specialization")
            .populate("userId", "name email");
        console.log(`✅ Medication suggestion created: ${medicationName}`);
        res.json(populatedSuggestion);
    }
    catch (error) {
        console.error("❌ Error creating medication suggestion:", error);
        res.status(500).json({ error: "Failed to create medication suggestion" });
    }
};
exports.suggestMedication = suggestMedication;
const getMedicationSuggestions = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        console.log(`📋 Fetching medication suggestions for user ${userId}`);
        const suggestions = await MedicationSuggestion_1.default.find({
            userId,
            accepted: false
        }).populate("doctorId", "name specialization photo")
            .sort({ createdAt: -1 });
        console.log(`✅ Found ${suggestions.length} pending medication suggestions`);
        res.json(suggestions);
    }
    catch (error) {
        console.error("❌ Error fetching medication suggestions:", error);
        res.status(500).json({ error: "Failed to fetch medication suggestions" });
    }
};
exports.getMedicationSuggestions = getMedicationSuggestions;
const acceptMedicationSuggestion = async (req, res) => {
    try {
        const { suggestionId, scheduleTime } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        if (!suggestionId || !scheduleTime) {
            return res.status(400).json({
                error: "suggestionId and scheduleTime are required"
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(suggestionId)) {
            return res.status(400).json({ error: "Invalid suggestion ID" });
        }
        console.log(`📝 User ${userId} accepting medication suggestion ${suggestionId}`);
        const suggestion = await MedicationSuggestion_1.default.findById(suggestionId);
        if (!suggestion) {
            return res.status(404).json({ error: "Medication suggestion not found" });
        }
        if (suggestion.userId.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to accept this suggestion" });
        }
        if (suggestion.accepted) {
            return res.status(400).json({ error: "Medication suggestion already accepted" });
        }
        suggestion.accepted = true;
        await suggestion.save();
        const scheduleEntry = new MedicationSchedule_1.default({
            userId,
            medicationName: suggestion.medicationName,
            dosage: suggestion.dosage,
            scheduleTime,
            isActive: true
        });
        await scheduleEntry.save();
        console.log(`✅ Medication ${suggestion.medicationName} accepted and scheduled`);
        res.json({
            suggestion,
            schedule: scheduleEntry
        });
    }
    catch (error) {
        console.error("❌ Error accepting medication suggestion:", error);
        res.status(500).json({ error: "Failed to accept medication suggestion" });
    }
};
exports.acceptMedicationSuggestion = acceptMedicationSuggestion;
const getMedicationSchedule = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        console.log(`📋 Fetching medication schedule for user ${userId}`);
        const schedule = await MedicationSchedule_1.default.find({
            userId,
            isActive: true
        }).sort({ scheduleTime: 1 });
        console.log(`✅ Found ${schedule.length} scheduled medications`);
        res.json(schedule);
    }
    catch (error) {
        console.error("❌ Error fetching medication schedule:", error);
        res.status(500).json({ error: "Failed to fetch medication schedule" });
    }
};
exports.getMedicationSchedule = getMedicationSchedule;
//# sourceMappingURL=medicationSuggestionController.js.map