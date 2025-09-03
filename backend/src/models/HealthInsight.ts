import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthInsight extends Document {
  userId: Schema.Types.ObjectId;
  type: 'trend' | 'alert' | 'recommendation' | 'achievement';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  isRead: boolean;
  generatedAt: Date;
  expiresAt?: Date;
  relatedMetricType?: string;
  actionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HealthInsightSchema = new Schema<IHealthInsight>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
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
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for efficient queries
HealthInsightSchema.index({ userId: 1, isRead: 1, generatedAt: -1 });
HealthInsightSchema.index({ userId: 1, severity: 1, generatedAt: -1 });
HealthInsightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time since generated
HealthInsightSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now.getTime() - this.generatedAt.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
});

export default mongoose.model<IHealthInsight>('HealthInsight', HealthInsightSchema);
