import mongoose, { Schema, Document } from 'mongoose';

export interface IChallengeParticipant extends Document {
  userId: Schema.Types.ObjectId;
  challengeId: Schema.Types.ObjectId;
  joinedAt: Date;
  progress: number;
  completed: boolean;
  lastUpdated: Date;
  streak: number;
  personalBest?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeParticipantSchema = new Schema<IChallengeParticipant>(
  {
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
    joinedAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0
    },
    completed: {
      type: Boolean,
      default: false,
      index: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    streak: {
      type: Number,
      default: 0,
      min: 0
    },
    personalBest: {
      type: Number,
      min: 0
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for efficient queries
ChallengeParticipantSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
ChallengeParticipantSchema.index({ challengeId: 1, progress: -1 });
ChallengeParticipantSchema.index({ userId: 1, completed: 1, joinedAt: -1 });

// Virtual for completion percentage
ChallengeParticipantSchema.virtual('completionPercentage').get(function() {
  // This would need to be calculated based on the challenge target
  // For now, return a basic calculation
  return Math.min((this.progress / 100) * 100, 100);
});

export default mongoose.model<IChallengeParticipant>('ChallengeParticipant', ChallengeParticipantSchema);
