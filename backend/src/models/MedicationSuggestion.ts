import mongoose, { Schema, Document } from "mongoose";

export interface IMedicationSuggestion extends Document {
  userId: Schema.Types.ObjectId;
  doctorId: Schema.Types.ObjectId;
  medicationName: string;
  dosage: string;
  instructions: string;
  accepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationSuggestionSchema = new Schema<IMedicationSuggestion>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true },
    instructions: { type: String, required: true },
    accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for efficient queries
MedicationSuggestionSchema.index({ userId: 1, accepted: 1 });

export default mongoose.model<IMedicationSuggestion>("MedicationSuggestion", MedicationSuggestionSchema);
