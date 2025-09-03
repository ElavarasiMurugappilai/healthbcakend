import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  type: 'fitness' | 'wellness' | 'nutrition' | 'mental_health' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  target: number;
  unit: string;
  duration: number; // in days
  points: number;
  icon?: string;
  tip?: string;
  isActive: boolean;
  participants: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  current: number;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  joinedAt: Date;
  completedAt?: Date;
  lastUpdated: Date;
}

const ChallengeSchema: Schema = new Schema({
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

// Indexes for efficient queries
ChallengeSchema.index({ type: 1, isActive: 1 });
ChallengeSchema.index({ difficulty: 1, isActive: 1 });

// Virtual for progress percentage
ChallengeSchema.virtual('progressPercentage').get(function() {
  // This would be calculated based on user progress
  return 0;
});

const UserChallengeSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  challengeId: {
    type: Schema.Types.ObjectId,
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

// Compound indexes for efficient queries
UserChallengeSchema.index({ userId: 1, status: 1 });
UserChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

// Virtual for progress percentage
UserChallengeSchema.virtual('progressPercentage').get(function() {
  const challenge = this.populate('challengeId');
  if (challenge && (challenge as any).target) {
    return Math.min(100, (this.current / (challenge as any).target) * 100);
  }
  return 0;
});

// Virtual for days since joined
UserChallengeSchema.virtual('daysSinceJoined').get(function() {
  const diffTime = Math.abs(new Date().getTime() - this.joinedAt.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

export const Challenge = mongoose.model<IChallenge>('Challenge', ChallengeSchema);
export const UserChallenge = mongoose.model<IUserChallenge>('UserChallenge', UserChallengeSchema);