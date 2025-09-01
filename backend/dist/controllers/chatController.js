"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingMedicationSuggestions = exports.respondToMedicationSuggestion = exports.suggestMedication = exports.sendMessage = exports.getChatMessages = void 0;
const ChatMessage_1 = __importDefault(require("../models/ChatMessage"));
const MedicationSuggestion_1 = __importDefault(require("../models/MedicationSuggestion"));
const Medication_1 = __importDefault(require("../models/Medication"));
const mongoose_1 = __importDefault(require("mongoose"));
const getChatMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { doctorId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ error: "Invalid doctor ID" });
        }
        const messages = await ChatMessage_1.default.find({
            userId,
            doctorId
        })
            .populate('medicationSuggestionId')
            .sort({ createdAt: 1 })
            .limit(50);
        await ChatMessage_1.default.updateMany({ userId, doctorId, senderType: 'doctor', isRead: false }, { isRead: true });
        res.json(messages);
    }
    catch (error) {
        console.error("Error fetching chat messages:", error);
        res.status(500).json({ error: "Failed to fetch chat messages" });
    }
};
exports.getChatMessages = getChatMessages;
const sendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { doctorId } = req.params;
        const { message } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ error: "Invalid doctor ID" });
        }
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: "Message cannot be empty" });
        }
        const chatMessage = await ChatMessage_1.default.create({
            userId,
            doctorId,
            senderId: userId,
            senderType: 'user',
            message: message.trim(),
            messageType: 'text'
        });
        res.status(201).json(chatMessage);
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
};
exports.sendMessage = sendMessage;
const suggestMedication = async (req, res) => {
    try {
        const userId = req.user.id;
        const { doctorId } = req.params;
        const { medicationName, dosage, frequency, reason } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ error: "Invalid doctor ID" });
        }
        if (!medicationName || !dosage || !frequency) {
            return res.status(400).json({
                error: "Medication name, dosage, and frequency are required"
            });
        }
        const medicationSuggestion = await MedicationSuggestion_1.default.create({
            userId,
            doctorId,
            medicationName,
            dosage,
            frequency,
            reason: reason || `Recommended ${medicationName} for your health condition`,
            status: 'pending'
        });
        const chatMessage = await ChatMessage_1.default.create({
            userId,
            doctorId,
            senderId: doctorId,
            senderType: 'doctor',
            message: `I recommend ${medicationName} (${dosage}) - ${frequency}. ${reason || 'This will help with your treatment.'}`,
            messageType: 'medication_suggestion',
            medicationSuggestionId: medicationSuggestion._id
        });
        const populatedMessage = await ChatMessage_1.default.findById(chatMessage._id)
            .populate('medicationSuggestionId');
        res.status(201).json(populatedMessage);
    }
    catch (error) {
        console.error("Error suggesting medication:", error);
        res.status(500).json({ error: "Failed to suggest medication" });
    }
};
exports.suggestMedication = suggestMedication;
const respondToMedicationSuggestion = async (req, res) => {
    try {
        const userId = req.user.id;
        const { suggestionId } = req.params;
        const { action, scheduledTimes } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(suggestionId)) {
            return res.status(400).json({ error: "Invalid suggestion ID" });
        }
        if (!['accept', 'reject'].includes(action)) {
            return res.status(400).json({ error: "Invalid action" });
        }
        const suggestion = await MedicationSuggestion_1.default.findById(suggestionId);
        if (!suggestion || suggestion.userId.toString() !== userId) {
            return res.status(404).json({ error: "Medication suggestion not found" });
        }
        if (suggestion.status !== 'pending') {
            return res.status(400).json({ error: "Suggestion already responded to" });
        }
        suggestion.status = action === 'accept' ? 'accepted' : 'rejected';
        suggestion.respondedAt = new Date();
        await suggestion.save();
        if (action === 'accept') {
            await Medication_1.default.create({
                userId,
                doctorId: suggestion.doctorId,
                name: suggestion.medicationName,
                dosage: suggestion.dosage,
                frequency: suggestion.frequency,
                status: 'accepted',
                acceptedAt: new Date(),
                scheduledTimes: scheduledTimes || ['08:00']
            });
            await ChatMessage_1.default.create({
                userId,
                doctorId: suggestion.doctorId,
                senderId: userId,
                senderType: 'user',
                message: `I have accepted your medication suggestion: ${suggestion.medicationName}`,
                messageType: 'text'
            });
        }
        else {
            await ChatMessage_1.default.create({
                userId,
                doctorId: suggestion.doctorId,
                senderId: userId,
                senderType: 'user',
                message: `I have declined your medication suggestion: ${suggestion.medicationName}`,
                messageType: 'text'
            });
        }
        res.json({
            message: `Medication suggestion ${action}ed successfully`,
            suggestion
        });
    }
    catch (error) {
        console.error("Error responding to medication suggestion:", error);
        res.status(500).json({ error: "Failed to respond to medication suggestion" });
    }
};
exports.respondToMedicationSuggestion = respondToMedicationSuggestion;
const getPendingMedicationSuggestions = async (req, res) => {
    try {
        const userId = req.user.id;
        const suggestions = await MedicationSuggestion_1.default.find({
            userId,
            status: 'pending'
        })
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 });
        res.json(suggestions);
    }
    catch (error) {
        console.error("Error fetching medication suggestions:", error);
        res.status(500).json({ error: "Failed to fetch medication suggestions" });
    }
};
exports.getPendingMedicationSuggestions = getPendingMedicationSuggestions;
//# sourceMappingURL=chatController.js.map