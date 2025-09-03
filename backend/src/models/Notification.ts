import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'medication' | 'appointment' | 'challenge' | 'measurement' | 'system' | 'fitness' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.Mixed
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

// Indexes for efficient queries
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, type: 1 });
NotificationSchema.index({ userId: 1, priority: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time ago
NotificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
});

// Virtual for isExpired
NotificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt;
});

// Pre-save middleware to set default expiration
NotificationSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Default expiration: 30 days for low/medium, 7 days for high, 1 day for urgent
    const days = this.priority === 'urgent' ? 1 : this.priority === 'high' ? 7 : 30;
    this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
  next();
});

// Static method to create notification
NotificationSchema.statics.createNotification = async function(
  userId: string,
  type: string,
  title: string,
  message: string,
  options: {
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    actionUrl?: string;
    actionText?: string;
    metadata?: Record<string, any>;
    expiresAt?: Date;
  } = {}
) {
  const notification = new this({
    userId,
    type,
    title,
    message,
    ...options
  });

  return await notification.save();
};

// Static method to mark all as read for user
NotificationSchema.statics.markAllAsRead = async function(userId: string) {
  return await this.updateMany(
    { userId, isRead: false },
    { isRead: true, updatedAt: new Date() }
  );
};

// Static method to get unread count for user
NotificationSchema.statics.getUnreadCount = async function(userId: string) {
  const result = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), isRead: false } },
    { $count: "unreadCount" }
  ]);

  return result.length > 0 ? result[0].unreadCount : 0;
};

export default mongoose.model<INotification>('Notification', NotificationSchema);