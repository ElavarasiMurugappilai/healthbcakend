import mongoose, { Schema, Document } from "mongoose";

export interface IMedicationSchedule extends Document {
  userId: Schema.Types.ObjectId;
  medicationName: string;
  dosage: string;
  scheduleTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationScheduleSchema = new Schema<IMedicationSchedule>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true },
    scheduleTime: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for efficient queries
MedicationScheduleSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model<IMedicationSchedule>("MedicationSchedule", MedicationScheduleSchema);
