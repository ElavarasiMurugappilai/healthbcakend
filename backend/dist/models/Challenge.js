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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserChallenge = exports.Challenge = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ChallengeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['fitness', 'wellness', 'nutrition', 'mental_health', 'general'],
        required: true,
        index: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    target: {
        type: Number,
        required: true,
        min: 1
    },
    unit: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
        max: 365
    },
    points: {
        type: Number,
        required: true,
        min: 0
    },
    icon: {
        type: String,
        trim: true
    },
    tip: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    participants: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
ChallengeSchema.index({ type: 1, isActive: 1 });
ChallengeSchema.index({ difficulty: 1, isActive: 1 });
ChallengeSchema.virtual('progressPercentage').get(function () {
    return 0;
});
const UserChallengeSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    challengeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true,
        index: true
    },
    current: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'paused', 'abandoned'],
        default: 'active',
        index: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
UserChallengeSchema.index({ userId: 1, status: 1 });
UserChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
UserChallengeSchema.virtual('progressPercentage').get(function () {
    const challenge = this.populate('challengeId');
    if (challenge && challenge.target) {
        return Math.min(100, (this.current / challenge.target) * 100);
    }
    return 0;
});
UserChallengeSchema.virtual('daysSinceJoined').get(function () {
    const diffTime = Math.abs(new Date().getTime() - this.joinedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});
exports.Challenge = mongoose_1.default.model('Challenge', ChallengeSchema);
exports.UserChallenge = mongoose_1.default.model('UserChallenge', UserChallengeSchema);
//# sourceMappingURL=Challenge.js.map