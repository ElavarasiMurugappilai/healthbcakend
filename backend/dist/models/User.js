"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const HealthConditionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    diagnosedDate: { type: Date },
    severity: { type: String, enum: ['mild', 'moderate', 'severe'] }
});
const CareTeamMemberSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    img: { type: String },
    badge: { type: Number, default: 0 },
    unread: { type: Boolean, default: false },
    messages: [{ type: mongoose_1.Schema.Types.Mixed }]
});
const ProfileSchema = new mongoose_1.Schema({
    age: { type: Number, min: 0, max: 150 },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    weight: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    conditions: [HealthConditionSchema],
    allergies: { type: String },
    smoker: { type: Boolean, default: false },
    alcohol: { type: String, enum: ['none', 'occasional', 'regular'], default: 'none' },
    sleepHours: [{ type: Number, min: 0, max: 24 }],
    exercise: { type: String, enum: ['none', 'occasional', 'regular'], default: 'none' },
    exerciseTypes: [{ type: String }],
    exerciseDuration: [{ type: Number, min: 0 }],
    fitnessGoals: { type: String },
    waterIntake: [{ type: Number, min: 0 }],
    stepGoal: [{ type: Number, min: 0 }],
    trackGlucose: { type: Boolean, default: false },
    trackBP: { type: Boolean, default: false },
    trackHR: { type: Boolean, default: false },
    trackSleep: { type: Boolean, default: false },
    trackWeight: { type: Boolean, default: false },
    takeMeds: { type: Boolean, default: false },
    prescriptionFile: { type: String },
    medicationReminders: { type: Boolean, default: false },
    joinChallenges: { type: Boolean, default: false },
    challengeDifficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    rewardType: { type: String, enum: ['points', 'badges', 'discounts'] },
    notificationsEnabled: { type: Boolean, default: true },
    notificationTiming: { type: String, enum: ['morning', 'evening', 'anytime'], default: 'anytime' },
    pushNotifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    units: {
        weight: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
        height: { type: String, enum: ['cm', 'ft'], default: 'cm' },
        glucose: { type: String, enum: ['mg/dL', 'mmol/L'], default: 'mg/dL' }
    },
    careTeam: [CareTeamMemberSchema],
    selectedDoctors: [{ type: String }],
    selectedCards: {
        type: [String],
        enum: ['fitness', 'bloodGlucose', 'careTeam', 'medicationSchedule'],
        default: []
    },
    completedAt: { type: Date },
    lastUpdated: { type: Date, default: Date.now }
}, {
    timestamps: true,
    _id: false
});
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    name: {
        type: String,
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    profile: {
        type: ProfileSchema,
        default: () => ({})
    },
    selectedCards: {
        type: [String],
        enum: ['fitness', 'bloodGlucose', 'careTeam', 'medicationSchedule'],
        default: []
    },
    selectedDoctors: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Doctor' }],
    dashboardStyle: { type: String },
    fitnessGoal: { type: String },
    activityLevel: { type: String },
    stepTarget: { type: Number },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
UserSchema.index({ email: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(12);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
UserSchema.methods.getPublicProfile = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.verificationToken;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpires;
    return userObject;
};
UserSchema.pre('save', function (next) {
    if (this.isModified('profile')) {
        this.profile.lastUpdated = new Date();
    }
    next();
});
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map