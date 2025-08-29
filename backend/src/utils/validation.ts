import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation error handler
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.type === 'field' ? (error as any).path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? (error as any).value : undefined
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

// Auth validation rules
export const registerValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Measurement validation rules
export const measurementValidation: ValidationChain[] = [
  body('type')
    .isIn(['glucose', 'blood_pressure', 'heart_rate', 'weight', 'sleep', 'steps', 'water', 'exercise'])
    .withMessage('Invalid measurement type'),
  body('value')
    .notEmpty()
    .withMessage('Measurement value is required'),
  body('timestamp')
    .optional()
    .isISO8601()
    .withMessage('Invalid timestamp format'),
  body('unit')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Unit must be less than 20 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
];

// Profile/Quiz validation (flexible for partial updates)
export const profileValidation: ValidationChain[] = [
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('weight')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Weight must be between 0 and 1000'),
  body('height')
    .optional()
    .isFloat({ min: 0, max: 300 })
    .withMessage('Height must be between 0 and 300'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('sleepHours.*')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sleep hours must be between 0 and 24'),
  body('exerciseDuration.*')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Exercise duration must be a positive number'),
  body('waterIntake.*')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Water intake must be a positive number'),
  body('stepGoal.*')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Step goal must be a positive number')
];

// Custom validation for blood pressure
export const bloodPressureValidation = (req: Request, res: Response, next: NextFunction): void => {
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

// Sanitize quiz payload to remove any potentially harmful data
export const sanitizeQuizPayload = (payload: any): any => {
  const allowedFields = [
    'age', 'gender', 'weight', 'height', 'conditions', 'allergies', 'smoker', 'alcohol',
    'sleepHours', 'exercise', 'exerciseTypes', 'exerciseDuration', 'fitnessGoals',
    'waterIntake', 'stepGoal', 'trackGlucose', 'trackBP', 'trackHR', 'trackSleep',
    'trackWeight', 'takeMeds', 'prescriptionFile', 'medicationReminders',
    'joinChallenges', 'challengeDifficulty', 'rewardType', 'notificationsEnabled',
    'notificationTiming', 'pushNotifications', 'emailNotifications', 'smsNotifications',
    'units', 'careTeam', 'selectedDoctors', 'initialMeasurements'
  ];
  
  const sanitized: any = {};
  
  for (const field of allowedFields) {
    if (payload.hasOwnProperty(field)) {
      sanitized[field] = payload[field];
    }
  }
  
  return sanitized;
};
