"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeQuizPayload = exports.bloodPressureValidation = exports.profileValidation = exports.measurementValidation = exports.loginValidation = exports.registerValidation = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
            value: error.type === 'field' ? error.value : undefined
        }));
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors
        });
        return;
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.registerValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
exports.measurementValidation = [
    (0, express_validator_1.body)('type')
        .isIn(['glucose', 'blood_pressure', 'heart_rate', 'weight', 'sleep', 'steps', 'water', 'exercise'])
        .withMessage('Invalid measurement type'),
    (0, express_validator_1.body)('value')
        .notEmpty()
        .withMessage('Measurement value is required'),
    (0, express_validator_1.body)('timestamp')
        .optional()
        .isISO8601()
        .withMessage('Invalid timestamp format'),
    (0, express_validator_1.body)('unit')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Unit must be less than 20 characters'),
    (0, express_validator_1.body)('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes must be less than 500 characters')
];
exports.profileValidation = [
    (0, express_validator_1.body)('age')
        .optional()
        .isInt({ min: 0, max: 150 })
        .withMessage('Age must be between 0 and 150'),
    (0, express_validator_1.body)('gender')
        .optional()
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be male, female, or other'),
    (0, express_validator_1.body)('weight')
        .optional()
        .isFloat({ min: 0, max: 1000 })
        .withMessage('Weight must be between 0 and 1000'),
    (0, express_validator_1.body)('height')
        .optional()
        .isFloat({ min: 0, max: 300 })
        .withMessage('Height must be between 0 and 300'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('sleepHours.*')
        .optional()
        .isFloat({ min: 0, max: 24 })
        .withMessage('Sleep hours must be between 0 and 24'),
    (0, express_validator_1.body)('exerciseDuration.*')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Exercise duration must be a positive number'),
    (0, express_validator_1.body)('waterIntake.*')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Water intake must be a positive number'),
    (0, express_validator_1.body)('stepGoal.*')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Step goal must be a positive number')
];
const bloodPressureValidation = (req, res, next) => {
    if (req.body.type === 'blood_pressure') {
        const { metadata } = req.body;
        if (!metadata || typeof metadata.systolic !== 'number' || typeof metadata.diastolic !== 'number') {
            res.status(400).json({
                success: false,
                message: 'Blood pressure measurements require systolic and diastolic values in metadata'
            });
            return;
        }
        if (metadata.systolic < 50 || metadata.systolic > 300) {
            res.status(400).json({
                success: false,
                message: 'Systolic pressure must be between 50 and 300'
            });
            return;
        }
        if (metadata.diastolic < 30 || metadata.diastolic > 200) {
            res.status(400).json({
                success: false,
                message: 'Diastolic pressure must be between 30 and 200'
            });
            return;
        }
    }
    next();
};
exports.bloodPressureValidation = bloodPressureValidation;
const sanitizeQuizPayload = (payload) => {
    const allowedFields = [
        'age', 'gender', 'weight', 'height', 'conditions', 'allergies', 'smoker', 'alcohol',
        'sleepHours', 'exercise', 'exerciseTypes', 'exerciseDuration', 'fitnessGoals',
        'waterIntake', 'stepGoal', 'trackGlucose', 'trackBP', 'trackHR', 'trackSleep',
        'trackWeight', 'takeMeds', 'prescriptionFile', 'medicationReminders',
        'joinChallenges', 'challengeDifficulty', 'rewardType', 'notificationsEnabled',
        'notificationTiming', 'pushNotifications', 'emailNotifications', 'smsNotifications',
        'units', 'careTeam', 'selectedDoctors', 'initialMeasurements'
    ];
    const sanitized = {};
    for (const field of allowedFields) {
        if (payload.hasOwnProperty(field)) {
            sanitized[field] = payload[field];
        }
    }
    return sanitized;
};
exports.sanitizeQuizPayload = sanitizeQuizPayload;
//# sourceMappingURL=validation.js.map