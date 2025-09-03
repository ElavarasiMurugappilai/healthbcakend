import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicationLog extends Document {
  userId: Schema.Types.ObjectId;
  medicationId: Schema.Types.ObjectId;
  scheduledTime: Date;
  takenTime?: Date;
  status: 'taken' | 'missed' | 'skipped' | 'accepted' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationLogSchema = new Schema<IMedicationLog>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    medicationId: { 
      type: Schema.Types.ObjectId, 
      ref: 'MedicationSchedule', 
      required: true,
      index: true
    },
    scheduledTime: {
      type: Date,
      required: true,
      index: true
    },
    takenTime: {
      type: Date
    },
    status: {
      type: String,
      enum: ['taken', 'missed', 'skipped', 'accepted', 'rejected'],
      required: true,
      index: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for efficient queries
MedicationLogSchema.index({ userId: 1, scheduledTime: -1 });
MedicationLogSchema.index({ userId: 1, medicationId: 1, scheduledTime: -1 });
MedicationLogSchema.index({ userId: 1, status: 1, scheduledTime: -1 });

// Virtual for adherence calculation
MedicationLogSchema.virtual('isOnTime').get(function() {
  if (!this.takenTime || this.status !== 'taken') return false;
  const timeDiff = Math.abs(this.takenTime.getTime() - this.scheduledTime.getTime());
  return timeDiff <= 30 * 60 * 1000; // Within 30 minutes
});

export default mongoose.model<IMedicationLog>('MedicationLog', MedicationLogSchema);
