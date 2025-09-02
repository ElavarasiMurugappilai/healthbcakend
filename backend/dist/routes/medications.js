"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.get('/pending', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const pendingMedications = user.pendingMedications || [];
        res.json({
            success: true,
            message: 'Pending medications retrieved successfully',
            data: pendingMedications
        });
    }
    catch (error) {
        console.error('Error fetching pending medications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending medications',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/accept', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { medication } = req.body;
        if (!medication || !medication.name || !medication.dosage || !medication.frequency) {
            return res.status(400).json({
                success: false,
                message: 'Medication must include name, dosage, and frequency'
            });
        }
        const newMedication = {
            name: medication.name,
            dosage: medication.dosage,
            frequency: medication.frequency,
            status: 'pending',
            timeSlots: medication.timeSlots || [],
            suggestedBy: medication.suggestedBy || 'System',
            reason: medication.reason || '',
            acceptedAt: new Date()
        };
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, {
            $push: {
                medications: newMedication
            }
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            message: 'Medication accepted and added to schedule',
            data: {
                medication: newMedication,
                totalMedications: updatedUser.medications?.length || 0
            }
        });
    }
    catch (error) {
        console.error('Error accepting medication:', error);
        res.status(500).json({
            success: false,
            message: 'Error accepting medication',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/decline', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { medicationId, reason } = req.body;
        console.log(`User ${userId} declined medication ${medicationId}: ${reason}`);
        res.json({
            success: true,
            message: 'Medication declined successfully'
        });
    }
    catch (error) {
        console.error('Error declining medication:', error);
        res.status(500).json({
            success: false,
            message: 'Error declining medication',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=medications.js.map