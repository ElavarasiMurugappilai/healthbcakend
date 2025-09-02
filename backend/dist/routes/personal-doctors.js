"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.post('/personal', auth_1.authenticateToken, async (req, res) => {
    try {
        const { name, specialization } = req.body;
        const userId = req.user?.id;
        if (!name || !specialization) {
            return res.status(400).json({
                success: false,
                message: 'Name and specialization are required'
            });
        }
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        const personalDoctor = {
            _id: new Date().getTime().toString(),
            name: name.trim(),
            specialization: specialization.trim(),
            isPersonal: true,
            addedAt: new Date()
        };
        const user = await User_1.default.findByIdAndUpdate(userId, {
            $push: {
                personalDoctors: personalDoctor
            }
        }, { new: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(201).json({
            success: true,
            message: 'Personal doctor added successfully',
            data: personalDoctor
        });
    }
    catch (error) {
        console.error('Error adding personal doctor:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=personal-doctors.js.map