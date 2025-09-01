import mongoose, { Schema, Document } from "mongoose";

export interface IMedication extends Document {
  userId: Schema.Types.ObjectId;
  doctorId?: Schema.Types.ObjectId;
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  status: "pending" | "accepted" | "declined" | "scheduled";
  suggestedAt?: Date;
  acceptedAt?: Date;
  scheduledTimes?: string[]; // ["08:00", "20:00"]
  createdAt: Date;
  updatedAt: Date;
}

const MedicationSchema = new Schema<IMedication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    instructions: { type: String },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "declined", "scheduled"], 
      default: "pending" 
    },
    suggestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    scheduledTimes: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Add unique constraint to prevent duplicate medications per user
MedicationSchema.index({ userId: 1, name: 1, dosage: 1 }, { unique: true });

export default mongoose.model<IMedication>("Medication", MedicationSchema);
