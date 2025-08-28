"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSuggestionStatus = exports.getUserSuggestions = exports.createSuggestion = void 0;
const MedicationSuggestion_1 = __importDefault(require("../models/MedicationSuggestion"));
const UserProfile_1 = __importDefault(require("../models/UserProfile"));
const createSuggestion = async (req, res) => {
    try {
        const doctorId = req.user?._id;
        if (!doctorId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { userId, doctorName, doctorRole, condition, medications, reasonForSuggestion } = req.body;
        if (!userId || !doctorName || !doctorRole || !condition || !medications || !reasonForSuggestion) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const suggestion = new MedicationSuggestion_1.default({
            userId,
            doctorId,
            doctorName,
            doctorRole,
            condition,
            medications,
            reasonForSuggestion,
            status: 'pending'
        });
        await suggestion.save();
        return res.status(201).json({
            success: true,
            data: suggestion
        });
    }
    catch (error) {
        console.error('Error creating medication suggestion:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error creating medication suggestion'
        });
    }
};
exports.createSuggestion = createSuggestion;
const getUserSuggestions = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const suggestions = await MedicationSuggestion_1.default.find({ userId });
        return res.status(200).json({
            success: true,
            data: suggestions
        });
    }
    catch (error) {
        console.error('Error fetching medication suggestions:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching medication suggestions'
        });
    }
};
exports.getUserSuggestions = getUserSuggestions;
const updateSuggestionStatus = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { suggestionId, status } = req.body;
        if (!suggestionId || !status || !['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid request data' });
        }
        const suggestion = await MedicationSuggestion_1.default.findOne({ _id: suggestionId, userId });
        if (!suggestion) {
            return res.status(404).json({ message: 'Suggestion not found' });
        }
        suggestion.status = status;
        await suggestion.save();
        if (status === 'accepted') {
            const userProfile = await UserProfile_1.default.findOne({ userId });
            if (!userProfile) {
                return res.status(404).json({ message: 'User profile not found' });
            }
            const newMedications = suggestion.medications.map(med => ({
                name: med.name,
                qty: med.dosage,
                dosage: med.frequency,
                status: 'Upcoming',
                time: new Date().toLocaleTimeString()
            }));
            if (!userProfile.medications) {
                userProfile.medications = [];
            }
            userProfile.medications = [...userProfile.medications, ...newMedications];
            await userProfile.save();
        }
        return res.status(200).json({
            success: true,
            data: suggestion
        });
    }
    catch (error) {
        console.error('Error updating suggestion status:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error updating suggestion status'
        });
    }
};
exports.updateSuggestionStatus = updateSuggestionStatus;
//# sourceMappingURL=medicationSuggestionController.js.map