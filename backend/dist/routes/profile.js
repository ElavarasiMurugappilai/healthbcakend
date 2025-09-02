"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const Measurement_1 = __importDefault(require("../models/Measurement"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const router = express_1.default.Router();
router.post('/quiz', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const sanitizedPayload = (0, validation_1.sanitizeQuizPayload)(req.body);
        const { initialMeasurements, ...profileData } = sanitizedPayload;
        const updatedUser = await User_1.default.findByIdAndUpdate(req.user._id, {
            $set: {
                ...Object.keys(profileData).reduce((acc, key) => {
                    if (profileData[key] !== undefined && profileData[key] !== null) {
                        acc[`profile.${key}`] = profileData[key];
                    }
                    return acc;
                }, {}),
                'profile.lastUpdated': new Date(),
                'profile.completedAt': new Date()
            }
        }, {
            new: true,
            runValidators: true,
            upsert: false
        }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const savedMeasurements = [];
        if (initialMeasurements && Array.isArray(initialMeasurements)) {
            for (const measurement of initialMeasurements) {
                try {
                    const newMeasurement = new Measurement_1.default({
                        userId: req.user._id,
                        type: measurement.type,
                        value: measurement.value,
                        unit: measurement.unit,
                        timestamp: measurement.timestamp || new Date(),
                        notes: measurement.notes,
                        source: measurement.source || 'quiz',
                        metadata: measurement.metadata
                    });
                    const saved = await newMeasurement.save();
                    savedMeasurements.push(saved);
                }
                catch (measurementError) {
                    console.warn('⚠️ Failed to save measurement:', measurementError);
                }
            }
        }
        console.log(`✅ Quiz data updated for user: ${req.user.email}`);
        if (savedMeasurements.length > 0) {
            console.log(`✅ Saved ${savedMeasurements.length} initial measurements`);
        }
        res.json({
            success: true,
            message: 'Quiz data saved successfully',
            data: {
                profile: updatedUser.profile,
                user: {
                    _id: updatedUser._id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    isVerified: updatedUser.isVerified,
                    createdAt: updatedUser.createdAt,
                    updatedAt: updatedUser.updatedAt
                },
                measurements: savedMeasurements
            }
        });
    }
    catch (error) {
        console.error('❌ Quiz update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving quiz data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const latestMeasurements = await Measurement_1.default.getLatestByType(req.user._id, ['glucose', 'blood_pressure', 'heart_rate', 'weight', 'sleep', 'steps', 'water']);
        const userWithDoctors = await User_1.default.findById(req.user._id)
            .select('-password')
            .populate('selectedDoctors', 'name specialization photo rating experience');
        res.json({
            success: true,
            data: {
                profile: req.user.profile,
                user: userWithDoctors?.getPublicProfile() || req.user.getPublicProfile(),
                latestMeasurements
            }
        });
    }
    catch (error) {
        console.error('❌ Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const latestMeasurements = await Measurement_1.default.getLatestByType(req.user._id, ['glucose', 'blood_pressure', 'heart_rate', 'weight', 'sleep', 'steps', 'water']);
        res.json({
            success: true,
            data: {
                profile: req.user.profile,
                user: req.user.getPublicProfile(),
                latestMeasurements
            }
        });
    }
    catch (error) {
        console.error('❌ Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.post('/dashboard-quiz', auth_1.authenticateToken, async (req, res) => {
    try {
        console.log('📥 Dashboard quiz request received');
        console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
        console.log('📥 User:', req.user?.email);
        if (!req.user) {
            console.log('❌ No authenticated user found');
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { selectedCards, selectedDoctors, ...dashboardPreferences } = req.body;
        console.log('📝 Selected cards:', selectedCards);
        console.log('📝 Dashboard preferences:', dashboardPreferences);
        if (selectedCards && !Array.isArray(selectedCards)) {
            console.log('❌ selectedCards is not an array:', typeof selectedCards);
            return res.status(400).json({
                success: false,
                message: 'selectedCards must be an array'
            });
        }
        console.log('💾 Updating user profile...');
        const updatedUser = await User_1.default.findByIdAndUpdate(req.user._id, {
            $set: {
                'profile.dashboardPreferences': dashboardPreferences,
                'profile.selectedCards': selectedCards || [],
                'profile.dashboardQuizCompleted': true,
                'profile.dashboardQuizCompletedAt': new Date(),
                'profile.lastUpdated': new Date(),
                'selectedCards': selectedCards || [],
                'selectedDoctors': selectedDoctors || [],
                'dashboardStyle': dashboardPreferences.dashboardStyle,
                'fitnessGoal': dashboardPreferences.fitnessGoal,
                'activityLevel': dashboardPreferences.activityLevel,
                'stepTarget': dashboardPreferences.stepTarget
            }
        }, { new: true, runValidators: true }).select('-password').populate('selectedDoctors', 'name specialization photo rating experience');
        if (!updatedUser) {
            console.log('❌ User not found in database');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        console.log(`✅ Dashboard quiz completed for user: ${req.user.email}`);
        console.log('✅ Updated profile selectedCards:', updatedUser.profile?.selectedCards);
        res.json({
            success: true,
            message: 'Dashboard preferences saved successfully',
            data: {
                profile: updatedUser.profile,
                user: updatedUser.getPublicProfile()
            }
        });
    }
    catch (error) {
        console.error('❌ Dashboard quiz save error:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error saving dashboard preferences',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.put('/', auth_1.authenticateToken, validation_1.profileValidation, validation_1.handleValidationErrors, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const sanitizedPayload = (0, validation_1.sanitizeQuizPayload)(req.body);
        const updatedUser = await User_1.default.findByIdAndUpdate(req.user._id, {
            $set: {
                ...Object.keys(sanitizedPayload).reduce((acc, key) => {
                    if (sanitizedPayload[key] !== undefined && sanitizedPayload[key] !== null) {
                        acc[`profile.${key}`] = sanitizedPayload[key];
                    }
                    return acc;
                }, {}),
                'profile.lastUpdated': new Date()
            }
        }, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        console.log(`✅ Profile updated for user: ${req.user.email}`);
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                profile: updatedUser.profile,
                user: updatedUser.getPublicProfile()
            }
        });
    }
    catch (error) {
        console.error('❌ Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.default = router;
//# sourceMappingURL=profile.js.map