"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Doctor_1 = __importDefault(require("../models/Doctor"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/system', async (req, res) => {
    try {
        const systemDoctors = await Doctor_1.default.find({ isSystemApproved: true }).select('name specialization photo rating experience');
        res.json({
            success: true,
            message: 'System doctors retrieved successfully',
            data: systemDoctors
        });
    }
    catch (error) {
        console.error('Error fetching system doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching system doctors',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/selected', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const { selectedDoctors } = req.body;
        console.log('POST /doctors/selected - Request data:', {
            userId,
            selectedDoctors,
            userFromToken: req.user,
            userIdFromUser: req.user?._id,
            userIdFromUserString: req.user?._id?.toString()
        });
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User ID not found in token'
            });
        }
        if (!Array.isArray(selectedDoctors)) {
            return res.status(400).json({
                success: false,
                message: 'selectedDoctors must be an array'
            });
        }
        const doctorIds = selectedDoctors.filter(id => typeof id === 'string');
        const existingDoctors = await Doctor_1.default.find({
            _id: { $in: doctorIds },
            isSystemApproved: true
        });
        if (existingDoctors.length !== doctorIds.length) {
            return res.status(400).json({
                success: false,
                message: 'Some doctor IDs are invalid or not system doctors'
            });
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, { selectedDoctors: doctorIds }, { new: true }).populate('selectedDoctors', 'name specialization photo rating experience');
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            message: 'Selected doctors updated successfully',
            data: {
                selectedDoctors: updatedUser.selectedDoctors
            }
        });
    }
    catch (error) {
        console.error('Error updating selected doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating selected doctors',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get('/selected', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User ID not found in token'
            });
        }
        const user = await User_1.default.findById(userId).populate('selectedDoctors', 'name specialization photo rating experience');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            message: 'Selected doctors retrieved successfully',
            data: {
                selectedDoctors: user.selectedDoctors || []
            }
        });
    }
    catch (error) {
        console.error('Error fetching selected doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching selected doctors',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=doctors.js.map