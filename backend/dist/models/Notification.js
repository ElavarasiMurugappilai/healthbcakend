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
const NotificationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['medication', 'appointment', 'challenge', 'measurement', 'system', 'fitness', 'general'],
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
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
        index: true
    },
    actionUrl: {
        type: String,
        trim: true
    },
    actionText: {
        type: String,
        trim: true,
        maxlength: 50
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed
    },
    expiresAt: {
        type: Date,
        index: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, type: 1 });
NotificationSchema.index({ userId: 1, priority: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
NotificationSchema.virtual('timeAgo').get(function () {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1)
        return 'Today';
    if (diffDays === 2)
        return 'Yesterday';
    if (diffDays <= 7)
        return `${diffDays - 1} days ago`;
    if (diffDays <= 30)
        return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
});
NotificationSchema.virtual('isExpired').get(function () {
    return this.expiresAt && new Date() > this.expiresAt;
});
NotificationSchema.pre('save', function (next) {
    if (!this.expiresAt) {
        const days = this.priority === 'urgent' ? 1 : this.priority === 'high' ? 7 : 30;
        this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
    next();
});
NotificationSchema.statics.createNotification = async function (userId, type, title, message, options = {}) {
    const notification = new this({
        userId,
        type,
        title,
        message,
        ...options
    });
    return await notification.save();
};
NotificationSchema.statics.markAllAsRead = async function (userId) {
    return await this.updateMany({ userId, isRead: false }, { isRead: true, updatedAt: new Date() });
};
NotificationSchema.statics.getUnreadCount = async function (userId) {
    const result = await this.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId), isRead: false } },
        { $count: "unreadCount" }
    ]);
    return result.length > 0 ? result[0].unreadCount : 0;
};
exports.default = mongoose_1.default.model('Notification', NotificationSchema);
//# sourceMappingURL=Notification.js.map