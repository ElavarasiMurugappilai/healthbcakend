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
const mongoose_1 = __importStar(require("mongoose"));
const HealthInsightSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['trend', 'alert', 'recommendation', 'achievement'],
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'critical', 'success'],
        default: 'info',
        index: true
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    generatedAt: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },
    expiresAt: {
        type: Date,
        index: true
    },
    relatedMetricType: {
        type: String,
        trim: true
    },
    actionUrl: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
HealthInsightSchema.index({ userId: 1, isRead: 1, generatedAt: -1 });
HealthInsightSchema.index({ userId: 1, severity: 1, generatedAt: -1 });
HealthInsightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
HealthInsightSchema.virtual('timeAgo').get(function () {
    const now = new Date();
    const diff = now.getTime() - this.generatedAt.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1)
        return 'Just now';
    if (hours < 24)
        return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
});
exports.default = mongoose_1.default.model('HealthInsight', HealthInsightSchema);
//# sourceMappingURL=HealthInsight.js.map