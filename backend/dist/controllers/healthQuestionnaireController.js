"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionnaire = exports.submitQuestionnaire = void 0;
const HealthQuestionnaire_1 = __importDefault(require("../models/HealthQuestionnaire"));
const submitQuestionnaire = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const questionnaireData = req.body;
        const questionnaire = await HealthQuestionnaire_1.default.findOneAndUpdate({ userId }, { ...questionnaireData, userId }, { new: true, upsert: true });
        return res.status(200).json({
            success: true,
            data: questionnaire
        });
    }
    catch (error) {
        console.error('Error submitting health questionnaire:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error submitting health questionnaire'
        });
    }
};
exports.submitQuestionnaire = submitQuestionnaire;
const getQuestionnaire = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const questionnaire = await HealthQuestionnaire_1.default.findOne({ userId });
        if (!questionnaire) {
            return res.status(404).json({
                success: false,
                message: 'Health questionnaire not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: questionnaire
        });
    }
    catch (error) {
        console.error('Error fetching health questionnaire:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching health questionnaire'
        });
    }
};
exports.getQuestionnaire = getQuestionnaire;
//# sourceMappingURL=healthQuestionnaireController.js.map