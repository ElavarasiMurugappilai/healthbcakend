import mongoose, { Schema, Document } from "mongoose";

export interface IMedicationSchedule extends Document {
  userId: Schema.Types.ObjectId;
  medicationName: string;
  dosage: string;
  frequency: string;
  scheduleTime: string;
  source: 'manual' | 'doctor-suggestion';
  suggestionId?: Schema.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationScheduleSchema = new Schema<IMedicationSchedule>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    scheduleTime: { type: String, required: true },
    source: { 
      type: String, 
      enum: ['manual', 'doctor-suggestion'], 
      default: 'manual' 
    },
    suggestionId: { type: Schema.Types.ObjectId, ref: "MedicationSuggestion" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for efficient queries
MedicationScheduleSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model<IMedicationSchedule>("MedicationSchedule", MedicationScheduleSchema);
